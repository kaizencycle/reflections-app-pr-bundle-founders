# Security Policy (Cathedral Civic Governance)

## Branch Protection
- `main` and `release/*` are protected branches
- Required checks: `build`, `test`, `civic-vote`, `sast`, `license-scan`
- Require signed commits and signed tags
- Require pull request reviews from CODEOWNERS

## Civic Vote Gate
- All PRs must pass civic governance vote before merge
- Thresholds defined in `policy/constitution.yml`
- Emergency freeze capability via Elder multi-sig

## MCP Bridge Security
- MCP bridge server requires authentication token
- Tool execution is sandboxed and logged
- Rate limiting on tool calls per PR

## Emergency Procedures
- Elders multi-sig can enable 72h freeze via constitution
- Security incidents bypass normal voting for hotfixes

## Vulnerability Disclosure
- Report privately to founders@yourdomain.tld
- Do not open public issues for exploitable vulnerabilities
