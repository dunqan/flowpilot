---
type: spec
status: draft            # draft | approved | in-progress | implemented
milestone:
extends:                 # [[spec it builds on]] (optional)
supersedes:              # [[spec it replaces]] (optional)
owner: human
created: {{date}}
tags: [spec]
---

# Spec: <Title>

**TLDR** — three lines: what, for whom, why now.

## Problem
<!-- User/business problem. Link evidence: [[60-research/...]] -->

## Goals / Non-goals
- Goal:
- Non-goal:

## Design
<!-- The what and how: flows, data model, API contracts, states, edge cases. Written so an agent implements WITHOUT asking.
     Link the system pages you read: this spec changes [[page]] in these ways... -->

### Design assets
<!-- Folder spec: 20-specs/<date>-<slug>/spec.md + design/. Each asset: binding or illustrative. -->

## Touches
<!-- The docs plan: every system page this spec creates or updates. Approved together with Verification. -->
- update [[<page>]] — <what changes on the page>
- create [[<folder>/<page>]] — <what it will describe>

## Contract surfaces
<!-- schema & RLS · routes/URLs · stored config schemas · event names · i18n keys · env/config keys · published artefacts -->
| Surface | Change | additive / migrated / breaking |
|---|---|---|

## Phases
1. Phase A —
2. Phase B —

## Acceptance Criteria
- [ ] **AC-1**: Given <state>, When <action>, Then <outcome>

## Verification
| AC | Level (unit / integration / e2e) | Test (path or planned name) |
|----|----------------------------------|------------------------------|
| AC-1 | e2e | |

**Regression risk**: <!-- what could break; which existing tests cover it -->
**Manual QA** (only what automation cannot cover):

## Decisions & Alternatives
<!-- Decision → why → alternatives rejected. Mark human-decided (skeleton Q&A, interview) vs agent default. Big ones → ADR link. -->

## Open Questions
<!-- Skeleton stage: Q1… numbered, one per line, answerable. Later: anything still open. -->
- [ ] Q1:

## Changelog
<!-- Date — what changed vs this spec, commit/PR. Intent and decisions only; the current state lives in the system pages. -->
