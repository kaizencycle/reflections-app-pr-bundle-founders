# Actions Variables Setup Guide

## Overview

This repository uses **Actions Variables** to synchronize thresholds across multiple workflows. This ensures consistency between the PR size labeler and the bot-suggest auto-labeler.

## Required Variables

Go to **Repository Settings → Secrets and variables → Actions → Variables** and create these variables:

### Size Thresholds

| Variable Name | Recommended Value | Description |
|---------------|-------------------|-------------|
| `SIZE_XS_MAX` | `19` | Maximum lines for XS (extra small) PRs |
| `SIZE_S_MAX` | `99` | Maximum lines for S (small) PRs |
| `SIZE_M_MAX` | `499` | Maximum lines for M (medium) PRs |
| `SIZE_L_MAX` | `1499` | Maximum lines for L (large) PRs |
| `MAX_FILES_FOR_NON_XL` | `50` | Maximum files before labeling as XL |

### Access Control

| Variable Name | Example Value | Description |
|---------------|---------------|-------------|
| `ALLOWED_LABELERS` | `kaizencycle,teammate1,teammate2` | Comma-separated list of users who can apply `bot-suggest` label |

## How Variables Are Used

### PR Size Labeler (`.github/workflows/pr-size-labeler.yml`)
- Uses all size threshold variables to determine appropriate size label
- Creates/updates size labels with descriptions based on current thresholds
- Posts detailed stats comment with current threshold values

### Auto-Label Small PR (`.github/workflows/auto-label-small-pr.yml`)
- Uses `SIZE_S_MAX` as the threshold for "tiny" PRs (you can change to `SIZE_M_MAX` if preferred)
- Uses `MAX_FILES_FOR_NON_XL` as the file count limit
- Only labels PRs that touch `src/**` or `docs/**` paths

### Label Guard (`.github/workflows/label-guard.yml`)
- Uses `ALLOWED_LABELERS` to control who can apply `bot-suggest` label
- Removes unauthorized labels and leaves explanatory comments

## Size Categories

Based on the recommended thresholds:

- **XS (Extra Small)**: 0-19 lines changed
- **S (Small)**: 20-99 lines changed  
- **M (Medium)**: 100-499 lines changed
- **L (Large)**: 500-1499 lines changed
- **XL (Extra Large)**: 1500+ lines changed OR >50 files

## Bot-Suggest Eligibility

By default, PRs are auto-labeled with `bot-suggest` if they:
1. Are size **S** or smaller (≤99 lines changed)
2. Change ≤50 files
3. Only touch `src/**` or `docs/**` paths
4. Don't already have the `bot-suggest` label

## Customization

### Adjusting Bot-Suggest Threshold

To make the bot more/less aggressive, edit `.github/workflows/auto-label-small-pr.yml`:

```yaml
# More conservative (only XS PRs)
MAX_LINES: ${{ vars.SIZE_XS_MAX }}

# Current setting (S and smaller)
MAX_LINES: ${{ vars.SIZE_S_MAX }}

# More aggressive (M and smaller)  
MAX_LINES: ${{ vars.SIZE_M_MAX }}
```

### Changing Size Thresholds

Simply update the variables in Repository Settings. All workflows will pick up the new values immediately.

### Adding More Labelers

Update the `ALLOWED_LABELERS` variable with a comma-separated list of GitHub usernames.

## Fallback Values

If variables are not set, workflows use these defaults:
- `SIZE_XS_MAX`: 19
- `SIZE_S_MAX`: 99
- `SIZE_M_MAX`: 499
- `SIZE_L_MAX`: 1499
- `MAX_FILES_FOR_NON_XL`: 50
- `ALLOWED_LABELERS`: kaizencycle

## Testing

After setting up variables:

1. Create a small test PR (< 100 lines, only touching `src/**` or `docs/**`)
2. Verify it gets auto-labeled with both `bot-suggest` and appropriate size label
3. Check that the size comment appears with correct threshold values
4. Try having a non-maintainer add `bot-suggest` label to verify guard works

## Troubleshooting

### Variables Not Working
- Ensure variables are created in **Actions** section, not **Secrets**
- Variable names are case-sensitive
- Workflows may need to be re-triggered after variable changes

### Bot-Suggest Not Applied
- Check if PR only touches `src/**` or `docs/**` paths
- Verify PR size is under the threshold
- Ensure PR doesn't already have the label

### Size Labels Wrong
- Check that size threshold variables are set correctly
- Verify the math: XS_MAX < S_MAX < M_MAX < L_MAX
- Look at workflow logs for actual values being used
