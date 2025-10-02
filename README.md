# 🏛 Reflections App — Founder's Core

![Build](https://img.shields.io/github/actions/workflow/status/kaizencycle/reflections-app-pr-bundle-founders/ci.yml?style=for-the-badge&logo=github&label=BUILD)
![PR Size](https://img.shields.io/badge/PR%20Size-Auto--Labeled-8A2BE2?style=for-the-badge&logo=git&logoColor=white)
![Auto Merge](https://img.shields.io/badge/Auto--Merge-Hermes+Zeus-FFD700?style=for-the-badge&logo=githubactions&logoColor=black)
![Safe Merge](https://img.shields.io/badge/Safe--to--Merge-Enabled-32CD32?style=for-the-badge&logo=checkmarx&logoColor=white)
![Governance](https://img.shields.io/badge/Governance-Cathedral%20OS-1E90FF?style=for-the-badge&logo=castle&logoColor=white)

## 🧭 What is this?

This is the **Founder's Lab Chamber** of the Cathedral OS.  
It governs **all Labs & Chambers** (Lab4: Research, Lab6: Ethics, Lab7: Health, etc.) using encoded governance.

- **Hermes** ✍️ — logs, labels PRs, and tracks history  
- **Zeus** ⚡ — arbitrates merges, enforces guardrails, and removes unsafe labels  

Here, **PRs are civic proposals**.  
Checks = deliberation.  
Merge = motion passed.  

## 🧪 Why it exists

This is the **proving ground** for AI-native governance.  
The Founder's Core tests rules and builds the Cathedral OS before it becomes public.

## 🚀 How it works

1. **Open a PR**  
   - Hermes auto-labels size (`XS` → `XL`) and trivial/safe-to-merge  
   - AI reviewer leaves notes  
2. **Checks run**  
   - All must pass  
3. **Zeus arbitrates**  
   - If `auto-merge` or `safe-to-merge`, GitHub auto-merges once green  
   - If checks fail, labels are stripped automatically

---

## 🎮 Game Integration

This repo is the **operating system** for the HIVE 16-bit game world:
- Quest completions → PRs to ledger
- Shard discoveries → commits to history  
- Citizen actions → governance proposals
- XP/GIC → stake in civic decisions

Two deployments:

- **Public onboarding** → `https://lab4-proof.onrender.com`
- **Founders PAW** (private, JADE/HERMES/EVE/ZEUS) → `https://reflections-app.onrender.com`

## 🤖 AI-Powered PR Reviews

This repository includes automated AI code reviews powered by **GitHub Models** and **OpenAI**! Every pull request gets automatically reviewed by AI that checks for:

- 🔒 Security vulnerabilities and auth issues
- ⚡ Performance bottlenecks
- 🎯 React/Next.js best practices
- 🧪 Testing recommendations
- 📐 Architecture improvements

### Quick Setup for AI Reviews

1. **Push to GitHub**: Make sure this repo is on GitHub with Actions enabled
2. **Add API Key** (Optional): For OpenAI fallback, add `OPENAI_API_KEY` to repository secrets
3. **Create a PR**: The AI reviewer will automatically comment with feedback!

The workflows are already configured in `.github/workflows/` - just push and create PRs! 🚀

---

## Setup
1. Copy `env.example` → `.env.local` and fill values.
2. Install deps: `npm i`
3. Dev: `npm run dev`

### Env flags

| var | public | founders |
|-----|--------|----------|
| `NEXT_PUBLIC_APP_TIER` | `public` | `founders` |
| `NEXT_PUBLIC_AUTH_BASE` | your API base | same |
| `NEXT_PUBLIC_USE_COOKIE_REFRESH` | `true` (recommended) | `true` |
| `SIGNUPS_DISABLED` | `false` | `true` (optional) |

### Auth API (expected)
- `POST /auth/register` → `{ email, password, ... }` → may return tokens
- `POST /auth/login` → `{ email, password }` → `{ accessToken, refreshToken?, user }`
- `POST /auth/refresh` → `{ refreshToken }` or cookie → `{ accessToken, refreshToken?, user? }`
- `POST /auth/logout` → clears cookie or accepts `{ refreshToken }`

### Founders-only guard
The `middleware.ts` checks JWT, requires `roles: ["founder"]` for the Founders app.
Admin can seed founders by updating `users.roles`.

### UI
- Mobile: companions sidebar is **off-canvas** drawer
- Desktop: fixed ~320px sidebar
- Accessibility: Esc-to-close, ARIA attrs, backdrop

### Packages added
`clsx`, `zustand`

---

## ⚙️ Setup and Installation

### Prerequisites
- Node.js (for running the React app)
- Git (for version control and AI review workflows)

### Your live FastAPI backend: 
https://hive-api-2le8.onrender.com

### Steps

1. **Clone or Create the Repository:**
   ```bash
   git clone https://github.com/kaizencycle/Reflections-app.git
   cd Reflections-app 
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run the Application:**
   The application will automatically connect to your live backend.
   ```bash
   npm start
   ```
   The app will open in your browser, usually at http://localhost:3000.

---

## 🔄 Development Workflow with AI Reviews

### Creating Feature Branches
```bash
# Create and switch to a new feature branch
git checkout -b feat/your-feature-name

# Make your changes in Cursor
# ... edit files ...

# Stage and commit changes
git add .
git commit -m "feat: add your feature description"

# Push to GitHub
git push -u origin feat/your-feature-name
```

### Getting AI Reviews
1. **Open a Pull Request** on GitHub
2. **Wait ~1-2 minutes** for the AI reviewer to analyze your code
3. **Review the feedback** posted as a comment on your PR
4. **Make improvements** based on AI suggestions
5. **Push updates** to get re-reviewed automatically

### Pre-commit Hook (Optional)
A pre-commit hook is already set up to run basic checks locally:
- Warns about console.log statements
- Checks for large files
- Counts TODO/FIXME comments
- Validates package.json changes

---

## 🛠️ AI Review Configuration

### GitHub Models (Default)
- Uses GitHub's built-in AI models
- No external API key required
- Configured in `.github/workflows/ai-pr-review.yml`

### OpenAI Fallback
- Uses OpenAI GPT-4o-mini for reviews
- Requires `OPENAI_API_KEY` in repository secrets
- Configured in `.github/workflows/ai-pr-review-openai.yml`

### Customizing Reviews
Edit the prompt in either workflow file to customize what the AI focuses on:
- Security concerns
- Performance optimization
- Code style preferences
- Testing requirements

---

## 📁 Project Structure
```
reflections-app/
├── .github/workflows/     # AI review workflows
├── src/                   # React source code
├── components/            # React components
├── stores/               # State management
├── config/               # Configuration files
└── public/               # Static assets
```

---

## 🚀 Next Steps

1. **Push this repo to GitHub** to enable AI reviews
2. **Create your first feature branch** and make some changes
3. **Open a PR** and watch the AI reviewer in action!
4. **Customize the AI prompts** in the workflow files to match your team's standards

Happy coding with your AI pair programmer! 🤖✨

## 🧪 Testing AI Reviews

This change was made to test the AI PR review functionality. The AI should analyze this diff and provide feedback on the documentation update.

## 🚀 Smoke Test - Complete AI Automation System

- **PR Size Labeler**: Should auto-label this PR with appropriate size (likely size:XS)
- **Auto-Label System**: May add `bot-suggest` if this touches safe paths and is small enough
- **AI Reviews**: GitHub Models and OpenAI fallback should provide code review
- **Label Guard**: Protects `bot-suggest` label from unauthorized users
- **Civic Governance**: All changes subject to democratic vote requirements

*This test verifies the complete civic-governed AI automation ecosystem is working correctly.*

---

## 🏛️ Governance & Workflow

This repository is part of the **Reflections App — Founders Edition**, an **open-facing Cathedral chamber** in the Civic AI project.

Here, contributions are not just code changes: they are **governance proposals**.
Every Pull Request (PR) is reviewed, labeled, and arbitrated by two core agents:

### **Hermes (The Scribe)** ✍️

* Tracks activity across the repo
* Logs PR stats (additions, deletions, file counts)
* Labels PRs by size (`size:XS` → `size:XL`)
* Suggests when a PR is `trivial` or `safe-to-merge`
* Provides AI-assisted review notes

### **Zeus (The Arbiter)** ⚡

* Enforces rules of the repo
* Manages auto-merge logic:
  * ✅ `auto-merge` → PR will merge once checks pass
  * ✅ `trivial` + `size:XS` → PR may auto-merge as safe-to-merge
* Removes merge labels if checks fail (fail-safe)
* Ensures no unsafe code bypasses governance

Together, **Hermes + Zeus** turn this repo into a **digital town hall**:

* **Every PR = a proposal**
* **Checks = deliberation** 
* **Merge = passed motion**

This mirrors the broader **Civic AI framework**: governance is transparent, accountable, and encoded into the workflow.

### 🚦 How to Contribute

1. **Open a Pull Request**
   * Hermes will label it by size and (if applicable) mark `trivial`
   * Tiny PRs (docs-only, whitespace, or <30 lines) may auto-label as `safe-to-merge`

2. **Checks & Reviews**
   * All PRs must pass required checks (tests, lint, build)
   * Reviews may be required if branch protection rules demand it

3. **Auto-Merge Paths**
   * Add the label **`auto-merge`** to let Zeus auto-merge when ready
   * If Hermes marks your PR as **`trivial` + `size:XS`**, Zeus may enable auto-merge automatically
   * If checks fail, Zeus will remove auto-merge labels until fixed

4. **Transparency**
   * Hermes leaves stats comments on every PR
   * If labels are added/removed automatically, a bot comment explains why

### 🌐 Why This Matters

This repo demonstrates a **Civic AI operating system** in practice.

* Citizens and contributors can see rules applied fairly — not by one maintainer, but by encoded accords
* It is an experiment in building **AI-native governance**: where transparency, safety, and collaboration converge

**Welcome to the Cathedral OS.** 🕊️

