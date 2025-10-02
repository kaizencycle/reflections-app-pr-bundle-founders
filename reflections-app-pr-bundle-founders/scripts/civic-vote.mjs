import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import https from 'node:https';

const { LEDGER_URL, LEDGER_TOKEN, REPO, PR_NUMBER } = process.env;
if (!LEDGER_URL || !LEDGER_TOKEN || !REPO || !PR_NUMBER) {
  console.error("Missing env vars: LEDGER_URL, LEDGER_TOKEN, REPO, PR_NUMBER");
  process.exit(1);
}

// Load constitution
const consPath = path.join(process.cwd(), 'policy', 'constitution.yml');
const consText = fs.existsSync(consPath) ? fs.readFileSync(consPath, 'utf8') : '';

// Parse constitution for thresholds (simple YAML parsing)
const thresholds = {
  default: 0.55,
  breaking: 0.66,
  docs: 0.50,
  governance: 0.75
};

if (consText) {
  const thresholdMatch = consText.match(/thresholds:\s*\n((?:\s+\w+:\s*[\d.]+\s*\n?)*)/);
  if (thresholdMatch) {
    const thresholdLines = thresholdMatch[1].match(/\s+(\w+):\s*([\d.]+)/g);
    if (thresholdLines) {
      thresholdLines.forEach(line => {
        const [, key, value] = line.match(/\s+(\w+):\s*([\d.]+)/);
        thresholds[key] = parseFloat(value);
      });
    }
  }
}

// Determine label class from GitHub event
let labelClass = 'default';
try {
  const evt = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
  const labels = (evt.pull_request?.labels || []).map(l => l.name.toLowerCase());
  
  if (labels.some(l => ['constitution', 'governance', 'voting'].includes(l))) {
    labelClass = 'governance';
  } else if (labels.some(l => ['breaking', 'security', 'consensus-change', 'api-change'].includes(l))) {
    labelClass = 'breaking';
  } else if (labels.some(l => ['docs', 'readme', 'documentation'].includes(l))) {
    labelClass = 'docs';
  }
} catch (e) {
  console.warn("Could not parse GitHub event, using default label class");
}

function httpGetJSON(url) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { 
      method: 'GET', 
      headers: { 
        'Authorization': `Bearer ${LEDGER_TOKEN}`,
        'User-Agent': 'civic-vote-gate/1.0'
      }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { 
          resolve(JSON.parse(data)); 
        } catch (e) { 
          reject(new Error(`Invalid JSON response: ${data}`)); 
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => reject(new Error('Request timeout')));
    req.end();
  });
}

// Query ledger for vote snapshot
const url = `${LEDGER_URL}/vote/snapshot?repo=${encodeURIComponent(REPO)}&pr=${encodeURIComponent(PR_NUMBER)}&class=${labelClass}`;
console.log(`Querying ledger: ${url}`);

try {
  const result = await httpGetJSON(url);
  const { yes = 0, no = 0, quorum = 150, freeze = false } = result;
  const threshold = thresholds[labelClass] || thresholds.default;
  const votes = yes + no;
  const ratio = votes ? (yes / votes) : 0;
  const passed = !freeze && votes >= quorum && ratio >= threshold;

  const output = { yes, no, quorum, threshold, votes, ratio, labelClass, freeze, passed };
  fs.writeFileSync('civic_vote_result.json', JSON.stringify(output, null, 2));
  console.log("CIVIC-VOTE RESULT:", output);
  
  if (!passed) {
    console.error(`Vote failed: ${votes}/${quorum} quorum, ${(ratio*100).toFixed(1)}%/${(threshold*100).toFixed(1)}% threshold`);
    process.exit(1);
  }
} catch (error) {
  console.error("Ledger query failed:", error.message);
  // Fail safe: if ledger is down, require manual review
  const output = { error: error.message, passed: false, manual_review_required: true };
  fs.writeFileSync('civic_vote_result.json', JSON.stringify(output, null, 2));
  process.exit(1);
}
