# PowerShell version of redaction scan for Windows compatibility
param(
    [switch]$Verbose
)

$ROOT = git rev-parse --show-toplevel
$FORBIDDEN_FILE = Join-Path $ROOT ".redaction/forbidden.regex"
$ALLOW_FILE = Join-Path $ROOT ".redaction/allowlist.regex"

if (-not (Test-Path $FORBIDDEN_FILE)) {
    Write-Host "No .redaction/forbidden.regex found — skipping scan." -ForegroundColor Yellow
    exit 0
}

$FORBIDDEN = (Get-Content $FORBIDDEN_FILE -Raw) -replace "`n", "|" -replace "\|$", ""
$ALLOW = ""
if (Test-Path $ALLOW_FILE) {
    $ALLOW = (Get-Content $ALLOW_FILE -Raw) -replace "`n", "|" -replace "\|$", ""
}

Write-Host "🔎 Redaction scan (repo-aware)…" -ForegroundColor Yellow

$FAILED = $false
$FILES = git ls-files | Where-Object { $_ -notmatch '^vendor/' -and $_ -notmatch '^docs/private/' }

foreach ($f in $FILES) {
    if (-not (Test-Path $f)) { continue }
    
    # Skip binary files
    $fileType = file $f 2>$null
    if ($fileType -match 'image|binary') { continue }
    
    $content = Get-Content $f -Raw -ErrorAction SilentlyContinue
    if (-not $content) { continue }
    
    # Check for forbidden terms
    $forbiddenMatches = [regex]::Matches($content, $FORBIDDEN, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    
    if ($forbiddenMatches.Count -gt 0) {
        # Check for allowed terms
        $allowedMatches = @()
        if ($ALLOW) {
            $allowedMatches = [regex]::Matches($content, $ALLOW, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        }
        
        # Filter out allowed matches
        $netMatches = @()
        foreach ($match in $forbiddenMatches) {
            $isAllowed = $false
            foreach ($allowMatch in $allowedMatches) {
                if ($match.Index -ge $allowMatch.Index -and $match.Index -le ($allowMatch.Index + $allowMatch.Length)) {
                    $isAllowed = $true
                    break
                }
            }
            if (-not $isAllowed) {
                $netMatches += $match
            }
        }
        
        if ($netMatches.Count -gt 0) {
            Write-Host "🚫 $f" -ForegroundColor Red
            foreach ($match in $netMatches) {
                $lineNumber = ($content.Substring(0, $match.Index) -split "`n").Count
                Write-Host "  Line $lineNumber`: $($match.Value)" -ForegroundColor Red
            }
            $FAILED = $true
        }
    }
}

if ($FAILED) {
    Write-Host "❌ Forbidden terms detected. Redact or move to private." -ForegroundColor Red
    exit 1
}

Write-Host "✅ No forbidden terms found." -ForegroundColor Green
