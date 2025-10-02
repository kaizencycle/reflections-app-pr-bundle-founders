# Hermes (Docs & Tests Agent) — Scaffold

**Role:** Opens PRs that improve docs/tests and adds commentary on open PRs.

## GitHub App Setup

Operate this as a GitHub App with least privileges:
- **Permissions:** Read/Write on Issues, Pull Requests, Contents (only in this repo)
- **Webhooks:** `pull_request`, `issues`, `issue_comment`, `push`
- **Installation:** Single repository or organization

## Behavior

1. **On `push`:** Scan diff for missing documentation or test coverage
2. **Open PR:** Title format `hermes: <short summary>`
3. **Never merge:** Relies on **civic-vote** gate + maintainer approval
4. **Respect constitution:** No changes to governance files without human sponsor

## MCP Integration

Hermes can use the same MCP tools as Cursor:
- `codebase_search`: Find related documentation
- `grep`: Search for test patterns
- `read_file`: Analyze existing docs
- `web_search`: Research best practices

## Configuration

Store agent policies in `/agents/hermes/policy/`:
- `prompts.yml`: System prompts and constraints
- `rules.yml`: What Hermes can/cannot do
- `templates/`: PR and comment templates

## Rate Limits

Per `policy/constitution.yml`:
- Max 5 PRs per day
- Cannot modify `/policy/`, `/.github/workflows/civic-vote.yml`, `/SECURITY.md`

## Audit Trail

All Hermes actions are logged publicly for transparency and accountability.
