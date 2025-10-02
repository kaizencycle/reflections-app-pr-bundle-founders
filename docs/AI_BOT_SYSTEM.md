# AI Bot System Documentation

## Overview

This repository includes a sophisticated AI bot system that can automatically propose tiny, safe fixes to pull requests. The system is designed with multiple safety layers and democratic governance.

## How It Works

### 1. Auto-Labeling (`auto-label-small-pr.yml`)
- Automatically labels small PRs (≤200 changed lines, ≤5 files) with `bot-suggest`
- Only applies to PRs that touch safe paths: `src/**` and `docs/**`
- Adds a helpful comment explaining the auto-labeling

### 2. Label Guard (`label-guard.yml`)
- Prevents unauthorized users from manually adding `bot-suggest` label
- Only maintainers listed in `ALLOWED_LABELERS` variable can apply the label
- Removes unauthorized labels and leaves a polite explanation

### 3. AI Bot Patch (`ai-bot-patch.yml`)
- Triggers only on PRs labeled with `bot-suggest`
- Uses GitHub Models (with OpenAI fallback) to analyze the PR
- Proposes tiny, safe fixes in unified diff format
- Creates a draft PR with the suggested improvements

## Safety Features

### Size Limits
- Maximum 200 changed lines
- Maximum 5 files
- Unified diff format validation

### Path Restrictions
- Only touches `src/**` and `docs/**`
- Blocks sensitive areas:
  - `.github/workflows/*`
  - `policy/*`
  - `security/*`
  - `SECURITY.md`
  - `scripts/civic-vote.mjs`

### Access Control
- `bot-suggest` label restricted to maintainers
- All bot PRs are created as drafts
- Human review required before merge

## Configuration

### Required Secrets
- `OPENAI_API_KEY` (optional, for fallback when GitHub Models unavailable)

### Required Variables
- `ALLOWED_LABELERS`: Comma-separated list of GitHub handles allowed to apply `bot-suggest`
  - Example: `kaizencycle,teammate1,teammate2`
  - Defaults to `kaizencycle` if not set

## Usage

### For Small PRs (Automatic)
1. Create a PR that only touches `src/**` or `docs/**`
2. Keep it small (≤200 lines, ≤5 files)
3. The system will auto-label it `bot-suggest`
4. AI will analyze and may create a draft improvement PR

### For Manual Labeling
1. Maintainers can manually add `bot-suggest` to any PR
2. Non-maintainers will have the label removed with explanation
3. AI bot will then analyze the labeled PR

### Bot PR Workflow
1. AI analyzes the original PR diff
2. Proposes a tiny, safe improvement
3. Creates draft PR with format: `bot: tiny fix from AI suggestion`
4. Links back to original PR
5. Requires human review and approval

## Example Bot PR

When the AI finds an improvement, it creates a draft PR like:

```
Title: bot: tiny fix from AI suggestion

Body:
🤖 Automated tiny patch proposed by AI. Please review carefully before merging.

Source PR: #123
Safety checks: ✅ Size limits, path restrictions, sensitive area protection

This draft PR was created because the source PR was labeled `bot-suggest` and met safety criteria.
```

## Governance Integration

This AI bot system integrates with the civic governance framework:
- All bot PRs must pass the civic vote gate
- Constitutional constraints apply to bot changes
- Emergency freeze can disable bot operations
- Transparent audit trail of all bot actions

## Troubleshooting

### Bot Not Triggering
- Check if PR has `bot-suggest` label
- Verify PR only touches `src/**` or `docs/**` paths
- Ensure PR is under size limits (200 lines, 5 files)

### Label Removed
- Only maintainers can apply `bot-suggest`
- Check `ALLOWED_LABELERS` variable configuration
- Contact maintainer to apply label if needed

### No Bot PR Created
- AI may not have found a safe improvement to suggest
- Check GitHub Actions logs for details
- Model may be unavailable (fallback to OpenAI)

## Future Enhancements

- Integration with MCP bridge for enhanced analysis
- Support for more file types beyond `src/**` and `docs/**`
- Configurable size limits per repository
- Integration with issue tracking for bot suggestions
