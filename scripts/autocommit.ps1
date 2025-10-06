# PowerShell auto-commit watcher for Windows
# Requires: Ollama installed; run from repo root in PowerShell

$branch = (git rev-parse --abbrev-ref HEAD).Trim()
Write-Host "🔁 Auto-commit running on branch: $branch (Ctrl+C to stop)" -ForegroundColor Green

# Check if Ollama is available
try {
  ollama list | Out-Null
  if ($LASTEXITCODE -ne 0) {
    throw "Ollama not available"
  }
} catch {
  Write-Host "❌ Ollama not found. Please install Ollama first." -ForegroundColor Red
  Write-Host "   Download from: https://ollama.ai" -ForegroundColor Yellow
  exit 1
}

# Check if we're in a git repository
try {
  git rev-parse --git-dir | Out-Null
  if ($LASTEXITCODE -ne 0) {
    throw "Not a git repository"
  }
} catch {
  Write-Host "❌ Not a git repository. Please run from repo root." -ForegroundColor Red
  exit 1
}

Write-Host "✅ Ollama and git detected. Starting file watcher..." -ForegroundColor Green

$fsw = New-Object IO.FileSystemWatcher "."
$fsw.IncludeSubdirectories = $true
$fsw.EnableRaisingEvents = $true
$fsw.Filter = "*.*"

# Exclude .git directory
$fsw.NotifyFilter = [IO.NotifyFilters]::LastWrite -bor [IO.NotifyFilters]::FileName -bor [IO.NotifyFilters]::DirectoryName

Register-ObjectEvent $fsw Changed -SourceIdentifier FileChanged -Action {
  Start-Sleep -Milliseconds 500  # Debounce rapid changes
  
  # Stage changes
  git add -A | Out-Null
  if ($LASTEXITCODE -ne 0) { 
    Write-Host "⚠️  Git add failed" -ForegroundColor Yellow
    return 
  }

  # Skip if nothing staged
  git diff --cached --quiet
  if ($LASTEXITCODE -eq 0) { return }

  # Generate message via Ollama
  try {
    $msg = bash -lc "scripts/generate-commit-msg.sh" 2>$null
    if ([string]::IsNullOrWhiteSpace($msg)) { 
      $msg = "chore: update" 
    }
  } catch {
    $msg = "chore: update"
  }

  # Commit & push
  git commit -m "$msg" | Out-Null
  if ($LASTEXITCODE -eq 0) {
    git push origin $branch | Out-Null
    Write-Host "📝 $msg" -ForegroundColor Cyan
  } else {
    Write-Host "⚠️  Commit failed" -ForegroundColor Yellow
  }
}

Write-Host "🔍 Watching for file changes..." -ForegroundColor Yellow
Write-Host "   Press Ctrl+C to stop" -ForegroundColor Gray

try {
  while ($true) { 
    Start-Sleep -Seconds 1 
  }
} finally {
  # Cleanup
  Unregister-Event -SourceIdentifier FileChanged -ErrorAction SilentlyContinue
  $fsw.Dispose()
  Write-Host "`n🛑 Auto-commit stopped" -ForegroundColor Yellow
}
