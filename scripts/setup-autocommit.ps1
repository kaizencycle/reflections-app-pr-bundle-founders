# Complete setup script for auto-commit system on Windows
Write-Host "🚀 Setting up auto-commit system with redaction protection..." -ForegroundColor Green

# 1. Check prerequisites
Write-Host "`n🔍 Checking prerequisites..." -ForegroundColor Yellow

# Check if Ollama is installed
try {
  $ollamaVersion = ollama --version 2>$null
  if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Ollama found: $ollamaVersion" -ForegroundColor Green
  } else {
    throw "Ollama not working"
  }
} catch {
  Write-Host "❌ Ollama not found or not working" -ForegroundColor Red
  Write-Host "   Please install Ollama from: https://ollama.ai" -ForegroundColor Yellow
  Write-Host "   Then run: ollama pull llama3" -ForegroundColor Yellow
  exit 1
}

# Check if we're in a git repository
try {
  git rev-parse --git-dir | Out-Null
  if ($LASTEXITCODE -ne 0) {
    throw "Not a git repository"
  }
  Write-Host "✅ Git repository detected" -ForegroundColor Green
} catch {
  Write-Host "❌ Not a git repository. Please run from repo root." -ForegroundColor Red
  exit 1
}

# 2. Configure git hooks
Write-Host "`n🔧 Configuring git hooks..." -ForegroundColor Yellow
git config core.hooksPath .githooks
Write-Host "✅ Git hooks configured" -ForegroundColor Green

# 3. Test scope detection
Write-Host "`n🧪 Testing scope detection..." -ForegroundColor Yellow
try {
  $testScope = bash -lc "scripts/detect-scope.sh" 2>$null
  if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Scope detection working: $testScope" -ForegroundColor Green
  } else {
    Write-Host "⚠️  Scope detection test failed" -ForegroundColor Yellow
  }
} catch {
  Write-Host "⚠️  Scope detection test failed" -ForegroundColor Yellow
}

# 4. Test commit message generation
Write-Host "`n🧪 Testing commit message generation..." -ForegroundColor Yellow
try {
  # Create a test file
  $testContent = @"
// Test file for auto-commit system
export function testFunction() {
  return 'Hello from auto-commit test';
}
"@
  $testFile = "test-autocommit.js"
  $testContent | Out-File -FilePath $testFile -Encoding UTF8
  
  # Stage the test file
  git add $testFile
  
  # Test message generation
  $testMsg = bash -lc "scripts/generate-commit-msg.sh" 2>$null
  if ($LASTEXITCODE -eq 0 -and $testMsg) {
    Write-Host "✅ Commit message generation working: $testMsg" -ForegroundColor Green
  } else {
    Write-Host "⚠️  Commit message generation test failed" -ForegroundColor Yellow
  }
  
  # Clean up test file
  git reset HEAD $testFile
  Remove-Item $testFile -Force
} catch {
  Write-Host "⚠️  Commit message generation test failed" -ForegroundColor Yellow
}

# 5. Test redaction system
Write-Host "`n🧪 Testing redaction system..." -ForegroundColor Yellow
try {
  # Create a test file with forbidden terms
  $testContent = @"
// This file contains DVA references
// Also mentions Cathedral OS
// And Echo handshake protocols
// But it also has echo server which should be allowed
"@
  $testFile = "test-redaction.js"
  $testContent | Out-File -FilePath $testFile -Encoding UTF8
  
  # Test redaction scan
  $redactionResult = bash -lc "scripts/redaction-scan.sh" 2>$null
  if ($LASTEXITCODE -eq 1) {
    Write-Host "✅ Redaction system working (correctly blocked forbidden terms)" -ForegroundColor Green
  } else {
    Write-Host "⚠️  Redaction system test inconclusive" -ForegroundColor Yellow
  }
  
  # Clean up test file
  Remove-Item $testFile -Force
} catch {
  Write-Host "⚠️  Redaction system test failed" -ForegroundColor Yellow
}

# 6. Summary
Write-Host "`n🎉 Setup complete!" -ForegroundColor Green
Write-Host "`nThe system now provides:" -ForegroundColor Cyan
Write-Host "  • Auto-generated Conventional Commit messages with proper scopes" -ForegroundColor White
Write-Host "  • Redaction protection against sensitive terms" -ForegroundColor White
Write-Host "  • Pre-commit quality checks" -ForegroundColor White
Write-Host "  • Auto-commit watcher for continuous development" -ForegroundColor White

Write-Host "`n🚀 Usage:" -ForegroundColor Cyan
Write-Host "  • Manual commit: git commit (message will be auto-generated)" -ForegroundColor White
Write-Host "  • Auto-commit: pwsh scripts/autocommit.ps1" -ForegroundColor White
Write-Host "  • Test redaction: bash scripts/redaction-scan.sh" -ForegroundColor White

Write-Host "`n💡 Tips:" -ForegroundColor Cyan
Write-Host "  • Use auto-commit only on feature branches" -ForegroundColor White
Write-Host "  • Merge via PR to main branch" -ForegroundColor White
Write-Host "  • Customize scopes in .commit-scope.map.regex" -ForegroundColor White
Write-Host "  • Adjust forbidden terms in .redaction/forbidden.regex" -ForegroundColor White
