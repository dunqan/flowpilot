---
type: adr
status: accepted
supersedes:
created: 2026-11-01
tags: [adr]
---
# ADR-0001: Record architecture decisions and run the repo on the agentic SDLC v2 playbook

## Context
FlowPilot is built mostly by coding agents across many sessions. Without durable, addressable records, every session re-derives decisions and repeats mistakes.

## Decision
- Architecture decisions are recorded as ADRs in `docs/30-adr/`, one decision per file, numbered `NNNN-<slug>`, from `docs/templates/adr.md`. Accepted ADRs are immutable; a change is a new ADR that supersedes the old one.
- The repository follows the agentic SDLC v2 playbook ([[2026-11-01-agentic-sdlc-v2-playbook]]): specs → runs → system pages → lessons, with human gates. The project-specific version of the model is the handbook, `docs/README.md`.

Accepted by the human in the bootstrap interview, 2026-11-01.

## Consequences
- Agents read accepted ADRs before architectural choices and draft new ones as `proposed`; only a human accepts.
- Process weight is proportional: trivial changes need no spec (handbook § When a spec is needed).

## Pages affected
- [[overview]] — links this ADR as the governing process decision.
