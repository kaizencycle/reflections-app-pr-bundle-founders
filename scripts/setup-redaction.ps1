# Setup script for redaction system on Windows
Write-Host "🔧 Setting up repo-aware redaction system..." -ForegroundColor Green

# Configure git hooks
git config core.hooksPath .githooks
Write-Host "✅ Git hooks configured" -ForegroundColor Green

# Test the redaction system
Write-Host "🔎 Testing redaction system..." -ForegroundColor Yellow

# Create a test file with forbidden terms
$testContent = @"
This is a test file.
It contains some DVA references.
Also mentions Cathedral OS.
And Echo handshake protocols.
But it also has echo server which should be allowed.
"@

$testFile = "test-redaction.txt"
$testContent | Out-File -FilePath $testFile -Encoding UTF8

Write-Host "Created test file with forbidden terms: $testFile" -ForegroundColor Yellow

# Test the forbidden terms detection
Write-Host "Testing forbidden terms detection..." -ForegroundColor Yellow
$forbiddenPattern = Get-Content ".redaction/forbidden.regex" -Raw
$allowPattern = Get-Content ".redaction/allowlist.regex" -Raw

# Simple PowerShell test
$content = Get-Content $testFile -Raw
$forbiddenMatches = [regex]::Matches($content, $forbiddenPattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
$allowMatches = [regex]::Matches($content, $allowPattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

Write-Host "Found $($forbiddenMatches.Count) forbidden term matches" -ForegroundColor Red
Write-Host "Found $($allowMatches.Count) allowed term matches" -ForegroundColor Green

# Clean up test file
Remove-Item $testFile -Force
Write-Host "✅ Test completed and cleaned up" -ForegroundColor Green

Write-Host "`n🎉 Redaction system setup complete!" -ForegroundColor Green
Write-Host "The system will now:" -ForegroundColor Cyan
Write-Host "  • Block commits with forbidden terms" -ForegroundColor White
Write-Host "  • Run CI scans on PRs" -ForegroundColor White
Write-Host "  • Require review for sensitive areas" -ForegroundColor White
Write-Host "  • Allow legitimate uses of similar terms" -ForegroundColor White
