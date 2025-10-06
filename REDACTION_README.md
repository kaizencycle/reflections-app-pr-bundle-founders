# 🔧 Repo-Aware Redaction System

This repository includes a comprehensive redaction system to prevent sensitive information from being committed to public branches while allowing legitimate uses of similar terms.

## 🛡️ What It Protects

The system automatically blocks commits and PRs containing these sensitive terms:
- **DVA** (Dynamic Virtual Architecture)
- **Kaizen-OS** internals
- **Echo handshake/heartbeat** protocols
- **Resonance equations**
- **Virtue Accords**
- **Founder's Core** specifics
- **Concord chamber** details
- **Dome kernel** internals
- **Custodian protocol** details
- **Cathedral OS** specifics
- **Companion checksum** details
- **Seed seal internals**

## ✅ What It Allows

Legitimate uses of similar terms are automatically allowed:
- "echo server" (web development)
- "echo endpoint" (API development)
- "echo websocket" (real-time communication)
- "concordance" (general usage)
- "resonance frequency" (audio/signal processing)
- "virtue" (non-Accords context)
- "autosweep test" (CI testing)
- "server-sent events" (web standards)
- "cathedral" (non-OS context)
- "founder" (non-Core context)

## 🚀 How It Works

### 1. Pre-commit Hook
- Runs automatically before each commit
- Scans staged files for forbidden terms
- Blocks commit if forbidden terms found
- Allows legitimate uses via allowlist

### 2. CI Workflow
- Runs on every PR and push to main/master
- Scans all tracked files
- Fails the build if forbidden terms detected
- Provides detailed error messages

### 3. Owner Review
- Sensitive areas require @kaizencycle review
- Includes: `/docs/*`, `/diagrams/*`, `/app/core/*`, `/packages/*`, `/.redaction/*`, `/policy/*`

## 🔧 Setup

### One-time Setup
```bash
# Configure git hooks
git config core.hooksPath .githooks

# On Windows, run the setup script
powershell -ExecutionPolicy Bypass -File scripts/setup-redaction.ps1
```

### Manual Testing
```bash
# Test the redaction system
bash scripts/redaction-scan.sh

# On Windows
powershell -File scripts/redaction-scan.ps1
```

## 📁 File Structure

```
.redaction/
  forbidden.regex     # Terms to block (repo-specific)
  allowlist.regex     # Terms to allow (overrides forbidden)
.githooks/
  pre-commit          # Local commit protection
scripts/
  redaction-scan.sh   # Unix/Linux scan script
  redaction-scan.ps1  # Windows PowerShell scan script
  setup-redaction.ps1 # Windows setup script
.github/
  workflows/redaction.yml  # CI workflow
  CODEOWNERS              # Review requirements
  SECURITY.md             # Security policy
  PULL_REQUEST_TEMPLATE.md # PR template
  ISSUE_TEMPLATE/         # Issue templates
docs/_includes/
  confidential-footer.md  # Standard confidential footer
```

## 🎯 Customization

### Adding Forbidden Terms
Edit `.redaction/forbidden.regex`:
```regex
(?i)\b(your-new-term|another-sensitive-concept)\b
```

### Adding Allowed Terms
Edit `.redaction/allowlist.regex`:
```regex
(?i)\byour-legitimate-usage\b
```

### Repo-Specific Configuration
Each repository can have its own forbidden/allowlist patterns:
- **genesisdome**: Focus on lore and public-facing terms
- **cathedral**: Workspace and chamber concepts
- **hive**: Game/companion UX terms
- **lab4-proof**: Reflections app specifics
- **lab6-proof**: Citizen Shield API terms
- **Civic-Protocol-Core**: Ledger/governance concepts

## 🚨 Emergency Procedures

### If Sensitive Content is Committed
1. **Immediately** move sensitive files to private repository
2. **Rewrite history** to remove sensitive content:
   ```bash
   git filter-repo --path sensitive-file.md --invert-paths
   git push --force origin main
   ```
3. **Update redaction patterns** to catch similar terms

### Bypassing Redaction (Emergency Only)
- Only for critical security fixes
- Requires maintainer approval
- Must be followed by immediate redaction pattern update

## 🔍 Troubleshooting

### Common Issues

**"No forbidden terms found" but terms are present:**
- Check if terms are in allowlist
- Verify regex patterns are correct
- Ensure file is tracked by git

**False positives:**
- Add legitimate usage to allowlist
- Refine forbidden patterns to be more specific

**Script not running on Windows:**
- Use PowerShell version: `scripts/redaction-scan.ps1`
- Ensure execution policy allows scripts

### Debug Mode
```bash
# Verbose output
bash scripts/redaction-scan.sh -v

# Windows
powershell -File scripts/redaction-scan.ps1 -Verbose
```

## 📋 Maintenance

### Regular Tasks
- Review and update forbidden terms quarterly
- Test redaction system after major changes
- Update allowlist when adding new legitimate features
- Monitor CI logs for false positives

### Security Reviews
- Audit redaction patterns annually
- Review CODEOWNERS assignments
- Test emergency procedures
- Update security documentation

## 🤝 Contributing

When contributing to this repository:
1. **Run redaction scan** before committing
2. **Use neutral terms** in public documentation
3. **Move sensitive details** to private repositories
4. **Follow the confidential footer** in docs
5. **Request review** for sensitive areas

## 📞 Support

For questions about the redaction system:
- Check this README first
- Review `.redaction/` configuration files
- Test with the provided scripts
- Contact maintainers listed in CODEOWNERS

---

> 🛡 **Remember**: This system protects your intellectual property while enabling open collaboration. Use it wisely and keep your secret sauce secret!
