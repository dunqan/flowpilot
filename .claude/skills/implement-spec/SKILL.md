---
name: implement-spec
description: Implement an approved spec (or selected phases) end-to-end - readiness analysis, tracked run file, tests, system-page updates in every phase, a converge pass, and code-review gates. Triggers on "implement spec", "build from spec", "implement phases".
---

# Implement Spec

## Pre-flight
1. Locate the spec; verify `status: approved` or `in-progress`, else STOP and ask.
2. Read: the spec, `AGENTS.md`, `docs/lessons.md` index, every system page in the spec's Touches (and `docs/25-system/README.md` if unfamiliar), lesson records whose `areas:` name those pages, linked ADRs, `.claude/skills/code-review/references/review-checklist.md`.
3. If the user scoped phases, implement only those.

## Analyze (readiness gate)
4. Cross-check: every AC has a Verification row and a phase; every Verification test maps to an AC; every Design area has a Touches page; every Contract surface marked breaking has a human decision. List tensions with `AGENTS.md` Always/Ask First/Never and with accepted ADRs.
5. Write the result as a **Readiness** block in the run file (step 7). Blockers (missing AC test, unapproved breaking change, ADR contradiction) → STOP and resolve in the spec with the human. Never "interpret around" a rule.

## Execute
6. Branch `feat/<spec-slug>`.
7. Create `docs/50-runs/YYYY-MM-DD-<slug>-run.md` from `docs/templates/run.md`; Plan from the spec's phases, each phase ending with a step "docs: update pages in Touches"; commit it FIRST. Set the spec `status: in-progress`.
8. Per step: implement → write/update tests → `node scripts/validate.mjs quick` → **update the system pages** for what this step shipped (present tense, Contracts, How to change it, Gotchas; bump `verified:` to the commit) → self-review against the checklist → commit → tick the Progress box with the SHA.
9. Ask-First trigger or ambiguity not covered by the spec → record under Blocked / Questions for human, STOP.

## Converge (per phase)
10. Spawn a fresh-context subagent with: spec path, run path, the diff since the phase started, and the instruction "Compare code and tests with the spec's ACs, Design and Touches. Report: unmet ACs, untested ACs, behaviour not in the spec, pages that do not describe what shipped. Do not fix anything." Append findings as unchecked steps under **Converge findings**; implement them via step 8; repeat until the pass reports nothing new (usually 1–2 rounds).

## Finish
11. `node scripts/validate.mjs` (full gate) and `node scripts/docs-check.mjs all --base origin/main`.
12. Spec Changelog: what was built, deviations (pre-approved only). Do not describe the system there; that is the page's job.
13. `git fetch origin && git rebase origin/main`; a real conflict (code, specs, shared docs) → STOP and ask.
14. Run `session-wrapup` (on the last phase it runs `archive-spec`). Open a PR from the template: Spec, Run, Pages changed (or `Docs: not-needed — <reason>`). Do NOT merge.
