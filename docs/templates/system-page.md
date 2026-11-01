---
type: system
area: <apps/<app> | backend/<concern> | packages/<pkg> | flows/<flow>>
sources:
  - <repo-relative path or glob this page owns>
specs: []                # [[implemented spec]] links that shaped this block
adrs: []                 # [[NNNN-...]] links
verified: {{date}} <sha> # last checked against the code, at this commit
tags: [system]
---

# <Block name>

**Purpose** — <1–3 sentences; include what it deliberately is not.>
**Sits between** — <callers> → this → <callees>

## Where
- `<path>` — <role>

## How it works
<!-- Present tense. Main flow, states, invariants that must hold, failure modes. -->

## Contracts
<!-- One line each; link the source of truth instead of restating it. -->
- <schema / route / event / config key> — <who depends on it>

## How to change it
1. **<Common change>** — steps; tests: `<command>`; pages to update: [[...]]

## Gotchas
<!-- Only lesson records whose areas: name this page. -->
- [[<lesson-slug>]] — <one line>

## History
- [[20-specs/implemented/<slug>/spec]] — <what it added>
- [[<NNNN-adr>]] — <the decision>
