# FlowPilot — Agent Guidelines

FlowPilot is a local-first, Markdown-native work and attention orchestration app: one portfolio view over several Markdown folders/vaults, context-aware Final Version Perfected (FVP) task selection, weekly outcomes, optional AI reflection. Agents build from **approved specs**; humans hold the gates; `docs/25-system/` describes the system as it is. Product: `docs/00-vision/vision.md`. Process explained: `docs/README.md` (the handbook).

## Repo Map

| Path | What |
|---|---|
| `apps/*` | deployable programs (engine service, web UI) — none yet |
| `packages/*` | domain libraries, UI-independent — none yet |
| `scripts/` | `validate.mjs`, `docs-check.mjs`, `archive-spec.mjs`, `md-to-wikilinks.mjs` |
| `agentic.config.json` | validation commands + docs-check settings (single source) |
| `.claude/skills/` | workflow skills: write-spec, implement-spec, code-review, archive-spec, session-wrapup, continue-run, weekly-review, write-system-page |
| `docs/00-vision/` | why the product exists; `flowpilot-concept.md` is the living concept brief |
| `docs/10-plans/` | `roadmap.md`, `milestones/` (human-checked gates) |
| `docs/20-specs/` | INTENT: pending specs; `implemented/` archive |
| `docs/25-system/` | STATE: how the system works now; `README.md` is the map |
| `docs/30-adr/` | WHY: numbered decisions, immutable once accepted |
| `docs/40-progress/` | weekly logs; `sessions/` fragments |
| `docs/50-runs/` | resumable execution plans per agent session |
| `docs/55-followups/` | what implemented specs still owe |
| `docs/60-research/` | evidence; `agentic-sdlc/` holds the process playbook |
| `docs/70-dashboards/` | Obsidian Bases over frontmatter |
| `docs/lessons.md`, `docs/lessons/` | lessons index + records; `inbox/` for proposals |
| `docs/templates/` | one template per document type |

## Always

1. **MUST work from an approved spec** for any feature or behaviour change (`status: approved` or `in-progress`). Trivial fixes (typo, dependency bump, pure refactor, test-only) need no spec.
2. **MUST read before editing**: the system page whose `sources:` cover the files, its Gotchas, and the lesson records whose `areas:` name it.
3. **MUST update the owning system page in the same phase** as the code change (present tense; `verified: <date> <sha>` only after actually checking the code), or carry `Docs: not-needed — <reason>`.
4. **MUST keep a run file** (`docs/50-runs/`) for spec work: first commit on the branch, Progress boxes ticked with SHAs, Handoff rewritten at wrap-up.
5. **MUST run the validation gate** before every commit (`node scripts/validate.mjs quick`) and the full gate plus `node scripts/docs-check.mjs all --base origin/main` before a PR.
6. **MUST treat the user's Markdown files as the source of truth**: never lose, reorder or reformat user content as a side effect; writes are minimal and conflict-safe.
7. **MUST keep domain logic in `packages/*`**, independent of the UI and of Obsidian.
8. **MUST use wikilinks** inside `docs/` (`[[page]]`; vault path for `README`/`spec` names; no `../`). Code paths in backticks.
9. **MUST end every session with `session-wrapup`.**

## Ask First

- Ask before changing a spec's scope, Design or ACs, or interpreting around an ambiguity — record it under the run's Blocked section and stop.
- Ask before any **breaking** change to a contract surface: the Markdown task format the app reads/writes, persisted state schemas, API routes, config keys.
- Ask before adding a **production** dependency or choosing a framework/library the architecture spec has not decided.
- Ask before writing to user files in ways not covered by the spec (new metadata, moving or renaming files).
- Ask before adding AI/network access to user data, or any telemetry.
- Ask before resolving a real rebase conflict in code, specs or shared docs.

## Never

- Never merge a PR, flip a spec to `approved`, accept an ADR, sign off a milestone gate, or edit `docs/lessons.md` — those are human gates.
- Never edit an implemented spec except its Changelog, or an accepted ADR — write a new spec/ADR that extends or supersedes it.
- Never put plans, rationale or history in system pages, or describe the current system in specs.
- Never bump `verified:` without checking the page against the code at that commit.
- Never scaffold empty pages, folders or "TBD" docs.
- Never commit secrets, personal vault contents, or real user data as fixtures.
- Never bulk-read `docs/lessons/`; use the index.

## Validation Commands

```bash
node scripts/validate.mjs            # full gate: commands in agentic.config.json
node scripts/validate.mjs quick      # per-step gate
node scripts/docs-check.mjs all --base origin/main
```

## Workflow

1. **Spec** — `write-spec`: skeleton + Open Questions → STOP for answers → draft → fresh-context review → `draft`. Human approves.
2. **Implement** — `implement-spec`: readiness analysis → branch `feat/<slug>` → run file → per step: code → tests → validate → system pages → self-review → commit → tick.
3. **Converge** — fresh-context subagent compares code with spec per phase; gaps become steps.
4. **Review** — `code-review` checklist; blockers fixed.
5. **Wrap up** — `session-wrapup` (last phase: `archive-spec`); PR from template. Human merges.
6. **Weekly** — `weekly-review` on `main`: progress, lessons inbox, follow-ups, docs lint.

## Task Router

| Task | Read first |
|---|---|
| Any session start | this file → `docs/lessons.md` → active run in `docs/50-runs/` (status `active`, matching branch) |
| Understand the product | `docs/00-vision/vision.md` → `docs/00-vision/flowpilot-concept.md` |
| What to build next | `docs/10-plans/milestones/M1.md` (§ Specs) |
| New feature or change | skill `write-spec` |
| Implement an approved spec | skill `implement-spec` |
| Resume interrupted work | skill `continue-run` |
| Review a diff / phase | skill `code-review` |
| Finish a session | skill `session-wrapup` |
| Archive a finished spec | skill `archive-spec` |
| Weekly progress / lessons / docs lint | skill `weekly-review` |
| Document a code area | skill `write-system-page` |
| How the system works / before touching code | `docs/25-system/README.md` → the owning page |
| Workspace, toolchain, CI, scripts | `docs/25-system/overview.md` |
| Architectural choice | `docs/30-adr/` (accepted ADRs) + `docs/templates/adr.md` |
| Process questions (gates, links, lessons, pages) | `docs/README.md` |
| New document of any type | `docs/templates/` |
