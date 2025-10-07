# Zeus (Issue→PR Agent) — Scaffold

**Role:** Converts tagged issues into draft PRs with passing CI.

## GitHub App Setup

Operate as a GitHub App with focused permissions:
- **Permissions:** Read/Write on Issues, Pull Requests, Checks
- **Webhooks:** `issues` (labeled), `issue_comment`
- **Trigger Labels:** `good-first-issue`, `zeus-ready`

## Behavior

1. **On issue labeled `zeus-ready`:** Create branch `zeus/<issue-#>`
2. **Generate change set:** Minimal implementation + tests
3. **Open draft PR:** Links back to original issue
4. **Pass to civic-vote:** All Zeus PRs subject to same governance
5. **Elder sponsor required:** For `breaking` label changes

## MCP Tool Usage

Zeus leverages MCP bridge for implementation:
- `codebase_search`: Understand existing patterns
- `grep`: Find similar implementations
- `read_file`: Study related code
- `web_search`: Research implementation approaches

## Safety Constraints

Per constitution:
- **Rate limit:** Max 3 PRs per 24h
- **Restricted paths:** Cannot modify governance files
- **Human sponsor:** Required for breaking changes
- **Draft only:** Never auto-merges

## Issue Format

For Zeus to process an issue, it should include:
```markdown
## Acceptance Criteria
- [ ] Specific, testable requirements

## Implementation Notes
- Suggested approach or constraints
```

## Quality Gates

All Zeus PRs must:
1. Pass existing CI/CD pipeline
2. Include appropriate tests
3. Meet civic vote requirements
4. Have human review before merge
