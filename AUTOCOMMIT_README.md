# 🤖 Auto-Commit System with Redaction Protection

This repository includes a complete auto-commit system that generates Conventional Commit messages using Ollama, while maintaining redaction protection against sensitive terms.

## 🎯 What It Does

- **Auto-generates** Conventional Commit messages with proper scopes
- **Protects** against sensitive term leaks (DVA, Cathedral OS, etc.)
- **Runs quality checks** before commits (linting, tests)
- **Watches files** for automatic commits during development
- **Works across platforms** (Windows, macOS, Linux)

## 🚀 Quick Start

### 1. Prerequisites
- **Ollama** installed with a model (e.g., `llama3`)
- **Git** repository
- **Bash** (for Windows: Git Bash or WSL)

### 2. One-time Setup
```bash
# Windows
powershell -ExecutionPolicy Bypass -File scripts/setup-autocommit.ps1

# macOS/Linux
bash scripts/setup-autocommit.sh
```

### 3. Usage Options

#### Option A: Manual Commits (Recommended)
```bash
# Stage your changes
git add .

# Commit (message auto-generated)
git commit
# The hook will generate a message like: "feat(reflections): add new component"
```

#### Option B: Auto-Commit Watcher
```bash
# Windows
pwsh scripts/autocommit.ps1

# macOS/Linux
./scripts/autocommit.sh
```

## 🔧 How It Works

### 1. Scope Detection
The system automatically detects the appropriate scope based on file paths:

```regex
# Examples from .commit-scope.map.regex
^src/pages/FoundersDemo\.jsx$ => founders-demo
^src/components/Companions\.tsx$ => companions
^agents/hermes/ => hermes
^\.github/workflows/ => ci
^docs/ => docs
```

### 2. Commit Message Generation
Uses Ollama to generate messages following Conventional Commits:

```
feat(companions): add new sidebar component
fix(auth): resolve token refresh issue
docs(readme): update installation instructions
chore(ci): update workflow configuration
```

### 3. Redaction Protection
Blocks commits containing sensitive terms:
- **DVA** (Dynamic Virtual Architecture)
- **Cathedral OS** specifics
- **Echo handshake** protocols
- **Founder's Core** details
- And more...

### 4. Quality Checks
Runs before each commit:
- Redaction scanning
- Linting (if available)
- Tests (if available)

## 📁 File Structure

```
scripts/
  detect-scope.sh          # Scope detection logic
  generate-commit-msg.sh   # Ollama-based message generation
  autocommit.sh           # Unix/Linux file watcher
  autocommit.ps1          # Windows PowerShell watcher
  setup-autocommit.ps1    # Windows setup script
  redaction-scan.sh       # Redaction scanning
  redaction-scan.ps1      # Windows redaction scanning

.githooks/
  pre-commit              # Quality checks + redaction
  prepare-commit-msg      # Auto-generate commit messages

.commit-scope.map.regex   # Per-repo scope rules
~/.config/kaizen/scope-map.regex  # Global scope rules

.redaction/
  forbidden.regex         # Terms to block
  allowlist.regex         # Terms to allow
```

## 🎛️ Configuration

### Customizing Scopes
Edit `.commit-scope.map.regex`:
```regex
# Add your own scope rules
^src/my-feature/ => my-feature ; weight=90
^tests/ => test ; weight=80
```

### Adjusting Forbidden Terms
Edit `.redaction/forbidden.regex`:
```regex
# Add more sensitive terms
(?i)\b(your-sensitive-term|another-secret)\b
```

### Changing the AI Model
Set the `MODEL` environment variable:
```bash
export MODEL=qwen2.5
# or
export MODEL=codellama
```

## 🔍 Testing

### Test Scope Detection
```bash
# Stage some files and test
git add src/components/MyComponent.tsx
bash scripts/detect-scope.sh
# Should output: components
```

### Test Commit Generation
```bash
# Stage changes and generate message
git add .
bash scripts/generate-commit-msg.sh
# Should output: feat(components): add MyComponent
```

### Test Redaction
```bash
# Test redaction scanning
bash scripts/redaction-scan.sh
# Should pass if no forbidden terms
```

## 🚨 Troubleshooting

### Common Issues

**"Ollama not found"**
- Install Ollama from https://ollama.ai
- Run `ollama pull llama3`

**"Scope detection failed"**
- Check `.commit-scope.map.regex` syntax
- Ensure staged files match patterns

**"Redaction blocking legitimate terms"**
- Add terms to `.redaction/allowlist.regex`
- Check regex patterns in forbidden list

**"Auto-commit not working on Windows"**
- Use PowerShell: `pwsh scripts/autocommit.ps1`
- Ensure execution policy allows scripts

### Debug Mode
```bash
# Verbose scope detection
bash scripts/detect-scope.sh -v

# Test with specific files
git add src/test.js
bash scripts/generate-commit-msg.sh
```

## 🎯 Best Practices

### For Development
- Use auto-commit on **feature branches** only
- Merge to main via **Pull Requests**
- Review generated messages before committing
- Keep sensitive details in private repos

### For Team Work
- Share scope mapping rules across repos
- Customize forbidden terms per project
- Use consistent Conventional Commit types
- Document any custom patterns

### For CI/CD
- The redaction system runs in CI
- Failed redaction blocks PRs
- Quality checks run on every commit
- Auto-generated messages improve PR history

## 🔄 Integration with Cursor

### Cursor Tasks
Add these as Cursor tasks:
- **Auto-commit**: `pwsh scripts/autocommit.ps1`
- **Test redaction**: `bash scripts/redaction-scan.sh`
- **Generate message**: `bash scripts/generate-commit-msg.sh`

### Cursor Commands
Create custom commands for:
- Scope detection
- Message generation
- Redaction testing
- Setup verification

## 📊 Monitoring

### Commit Quality
- Review generated messages regularly
- Adjust scope patterns based on usage
- Monitor redaction false positives
- Update forbidden terms as needed

### Performance
- Ollama model selection affects speed
- File watcher performance varies by OS
- Scope detection is fast (regex-based)
- Redaction scanning is lightweight

## 🆘 Support

### Getting Help
1. Check this README first
2. Review script error messages
3. Test individual components
4. Check Ollama and git status

### Contributing
- Improve scope detection patterns
- Add new quality checks
- Enhance redaction rules
- Optimize for your workflow

---

> 🎉 **Enjoy your AI-powered, secure development workflow!** The system handles the boring stuff so you can focus on building amazing features.
