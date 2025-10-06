# Security Policy

## Reporting a Vulnerability
Please open a **Private Advisory** or email the maintainers listed in CODEOWNERS.

## Sensitive Concepts
This project may integrate proprietary runtime logic and background schedulers.
Do not include implementation details or internal algorithms in issues/PRs.

> 🛡 Confidential Note  
> This schematic illustrates **process flow only**.  
> Core algorithms, Dynamic Virtual Architecture logic,  
> and proprietary resonance protocols remain sealed  
> within the Founder's private manifest.

## Redaction System
This repository uses automated redaction scanning to prevent sensitive information from being committed to public branches. The system scans for forbidden terms and blocks commits that contain them.

### Forbidden Terms
The following terms are automatically blocked:
- DVA (Dynamic Virtual Architecture)
- Kaizen-OS internals
- Echo handshake/heartbeat protocols
- Resonance equations
- Virtue Accords
- Founder's Core specifics
- Concord chamber details
- Dome kernel internals
- Custodian protocol details

### Allowlist
Legitimate uses of similar terms are allowed:
- "echo server" (web development)
- "concordance" (general usage)
- "virtue" (non-Accords context)
- "cathedral" (non-OS context)

## Emergency Procedures
- Security incidents bypass normal voting for hotfixes
- Maintainers can trigger emergency freeze via constitution
- Sensitive content should be moved to private repositories
