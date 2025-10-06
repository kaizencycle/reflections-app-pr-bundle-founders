#!/usr/bin/env bash
set -euo pipefail

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
echo "🔁 Auto-commit running on branch: $BRANCH"
echo "   (Ctrl+C to stop)"

# Paths to watch (edit if you want to narrow)
WATCH_PATHS="."

# Check if fswatch is available (macOS)
if command -v fswatch >/dev/null 2>&1; then
  echo "📱 Using fswatch (macOS)"
  while fswatch -1 --exclude '\.git' "$WATCH_PATHS" >/dev/null 2>&1; do
    # Stage changes
    git add -A

    # Skip if nothing new
    git diff --cached --quiet && continue

    # Generate message via Ollama
    MSG="$(scripts/generate-commit-msg.sh)"
    echo "📝 $MSG"

    # Commit & push
    git commit -m "$MSG" || true
    git push origin "$BRANCH" || true
  done
# Check if inotifywait is available (Linux)
elif command -v inotifywait >/dev/null 2>&1; then
  echo "🐧 Using inotifywait (Linux)"
  while inotifywait -r -e modify,create,delete,move --exclude '\.git' . >/dev/null 2>&1; do
    git add -A
    git diff --cached --quiet && continue
    MSG="$(scripts/generate-commit-msg.sh)"
    echo "📝 $MSG"
    git commit -m "$MSG" || true
    git push origin "$BRANCH" || true
  done
else
  echo "❌ No file watcher available. Install fswatch (macOS) or inotify-tools (Linux)"
  echo "   macOS: brew install fswatch"
  echo "   Linux: sudo apt-get install inotify-tools"
  exit 1
fi
