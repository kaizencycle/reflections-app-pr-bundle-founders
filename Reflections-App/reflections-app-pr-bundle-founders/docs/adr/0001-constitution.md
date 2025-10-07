# ADR-0001: Constitution & Civic Vote Gate

## Status
Accepted (Initial)

## Context
We want PR merges to reflect Civic governance principles:
- GIC-weighted votes (or 1p1v during bootstrapping)
- Thresholds based on change impact
- Constitutional constraints on governance changes
- Agent participation under same rules as humans

## Decision
- Store governance norms in `policy/constitution.yml`
- Enforce via GitHub Action `civic-vote`
- Vote snapshots from Cathedral Ledger via `LEDGER_URL`
- MCP bridge enables AI agents to use same tools as Cursor

## Architecture

### Civic Vote Gate
1. PR opened/updated triggers `civic-vote.yml`
2. Action calls ledger API for vote snapshot
3. Compares results against constitutional thresholds
4. Blocks merge if quorum/majority unmet

### MCP Bridge
1. GitHub Models analyzes PR and plans tool usage
2. MCP bridge server executes tools (codebase_search, grep, etc.)
3. Results enhance AI review with actual codebase knowledge
4. Same tools available to Cursor and CI/agents

## Consequences
### Positive
- Higher legitimacy through democratic governance
- Consistent tooling between development and automation
- Constitutional constraints prevent governance capture

### Negative
- Slower merges if quorum unmet
- Additional infrastructure complexity
