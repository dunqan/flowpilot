# FlowPilot handbook — how this repository is run

FlowPilot is built by coding agents from **approved specs**. Humans hold the gates, and the documentation describes the system **as it is**. This handbook is the human-readable version of the model. Agents get the condensed rules from `AGENTS.md`; the full source is [[2026-11-01-agentic-sdlc-v2-playbook]]. When this handbook and the playbook disagree, this handbook wins for FlowPilot.

## 1. Principles

1. **Docs are the source of truth; code follows specs.** A feature exists first as an approved spec, then as code that satisfies it, then as a system page that describes what shipped. Never in another order.
2. **Humans control gates, not keystrokes.** The human decides at five points: approving a spec, answering "Ask First" stops, merging PRs, signing off milestone gates, curating lessons. Accepting ADRs is part of approving the spec that proposes them.
3. **The repo must learn.** Every session leaves progress, a resumable run, decisions as ADRs, pitfalls as lessons, and current state in the system pages.
4. **Hot context is tiny; cold context is addressable.** `AGENTS.md` holds rules and routing only (≤ 200 lines). Everything else lives in small files at predictable paths.
5. **Rules that must always hold live in scripts, not prose.** A rule broken twice gets mechanised (`scripts/`, CI).
6. **Process weight matches problem size.** Over-speccing kills the system faster than under-speccing.

FlowPilot adds one product rule on top: **the user's Markdown is sacred.** Anything that reads or writes user files is specced, tested against fixtures, and changed only additively unless the human decides otherwise.

## 2. Three layers

| Layer | Question | Where |
|---|---|---|
| **Intent** | What should be true, and why? | `20-specs/`, `10-plans/`, `30-adr/` |
| **State** | What is true now? | `25-system/` |
| **Memory** | What happened, and what did we learn? | `40-progress/`, `50-runs/`, `55-followups/`, `lessons.md` + `lessons/` |

Keep them apart. A spec never becomes the description of the current system, a system page never argues for a change, and a run never debates design.

Also in the vault: `00-vision/` (why; [[vision]] plus the living concept brief [[flowpilot-concept]]), `60-research/` (evidence), `70-dashboards/` (Obsidian Bases), `80-ops/` (runbooks, once something is hosted) and `templates/`.

## 3. Document types

| Type | Folder | Lifecycle | Written by |
|---|---|---|---|
| Spec | `20-specs/` | `draft` → `approved` (human) → `in-progress` → `implemented` (moved to `implemented/`) | agent via `write-spec`; human approves |
| System page | `25-system/` | living; `verified: <date> <sha>` | agent in every phase; human reviews in the PR |
| ADR | `30-adr/` | `proposed` → `accepted` (immutable) → `superseded` | agent drafts; human accepts |
| Milestone | `10-plans/milestones/` | `planned` → `active` → `done` | human |
| Run | `50-runs/` | `active` → `paused` → `done` | agent |
| Follow-up | `55-followups/` | a bullet exists while work is owed | `archive-spec` |
| Progress | `40-progress/` | weekly file compiled from `sessions/` fragments | `session-wrapup` writes fragments; `weekly-review` compiles them |
| Lesson | `lessons/` + `lessons.md` | `inbox/` proposal → record (human sign-off) → promoted to `AGENTS.md`/CI or deleted | agent proposes; human curates |

Templates for every type are in `docs/templates/`.

### When a spec is needed
A spec is needed for any change of behaviour a user could notice, any change to how user files are read or written, any contract surface, and any new app or package. No spec is needed for typos, dependency bumps, pure refactors, test-only changes or docs fixes. Those still update the owning page, or waive it with a reason.

### Specs
Sections: Problem · Goals/Non-goals · Design · **Touches** (the system pages to create or update; the docs plan) · **Contract surfaces** · Phases · Acceptance Criteria (Given/When/Then, `AC-n`) · Verification (each AC mapped to a test) · Decisions & Alternatives · Open Questions · Changelog.

FlowPilot's contract surfaces are:
- the **Markdown task/project format** read from and written to user files;
- persisted engine state (index, FVP sessions, goals);
- engine API routes and change events;
- source-registration and app config schemas;
- environment and config keys;
- published artefacts.

Each touched surface is marked additive, migrated or breaking. A breaking change triggers Ask First.

Specs are **flow-forward**. Once implemented, a spec changes only in its Changelog, and new behaviour gets a new spec (`extends:` / `supersedes:`). `write-spec` always stops after a skeleton of numbered Open Questions until the human answers them.

### Runs
A run is named `YYYY-MM-DD-<slug>-run.md` and is the first commit on the branch. It holds Readiness (the pre-implementation cross-check), Plan, Progress boxes with SHAs, Converge findings, Blocked items and Handoff notes. When the run file and the checklist disagree, git wins.

### Lessons
`lessons.md` is an index with one row per record. Records in `lessons/<slug>.md` carry `areas:` (the system pages they concern) and are linked from those pages' Gotchas. A lesson is recorded only after an agent actually made the mistake, and the index must not grow without bound.

## 4. System pages (`25-system/`)

System pages describe how each building block works **now**: purpose, file map, mechanism, invariants, contracts, how to change it, gotchas, and links to the specs and ADRs that shaped it. The test for every sentence: *could an agent that reads only this page continue the work in the right place?*

- **Mirror the code at building-block level**: one page per app, per package (or package family), plus `flows/` for mechanisms that cross blocks (e.g. "an external edit reaches the FVP session"). Depth follows risk.
- **Never scaffold empty.** A page is born in the spec phase that gives it content. Every folder has a `README.md` index; `25-system/README.md` is the map.
- **Anatomy** (template `templates/system-page.md`): frontmatter `sources:` (the code it owns, precise paths), `specs`, `adrs`, `verified: <date> <sha>`; ≤ 150 lines; present tense; no plans, rationale or history prose.
- **Ownership is checked.** Every `apps/*` and `packages/*` directory with code must be in some page's `sources:` (`docs-check coverage`). A PR that changes code there must change an owning page (`docs-check owners`) or carry `Docs: not-needed — <reason>`, which is legitimate for refactors, test-only changes and dependency bumps, and a review blocker on feature PRs.
- **Lifecycle.** `write-spec` reads the pages and fills Touches; `implement-spec` updates them inside every phase; `code-review` checks them; `archive-spec` sweeps them; `weekly-review` lints for staleness (`git log <verified-sha>..HEAD -- <sources>`).

## 5. Links and naming

- Inside `docs/` use **wikilinks**: `[[page]]`, `[[page#Heading]]`, `[[page|label]]`. Obsidian is configured for wikilinks with shortest paths. GitHub renders them as text, which is accepted.
- Basenames are unique across the vault, except `README.md`, `spec.md` and design assets, which are linked by vault path, e.g. [[25-system/README|System map]] or `[[20-specs/<slug>/spec]]`. Never use `../`. Code paths go in backticks, never in wikilinks.
- Naming:
  - specs: `YYYY-MM-DD-<slug>`
  - runs: `YYYY-MM-DD-<slug>-run`
  - ADRs: `NNNN-<slug>`
  - system pages: `<block>`
  - lessons: `<rule-as-slug>`
  - session fragments: `YYYY-MM-DD-<branch-slug>-<sha>`

## 6. The loop

```
 idea ─► write-spec: research → skeleton + Open Questions ⛔ human answers → draft → cohesion review
      ─► ⛔ HUMAN APPROVES spec (Design, ACs, Verification, Touches)
      ─► implement-spec: readiness → branch → run file → per phase:
             implement → tests → validate → UPDATE SYSTEM PAGES → self-review → commit → tick (sha)
             ⛔ Ask First → STOP
         converge: fresh-context pass compares code with spec → gaps become steps → repeat until stable
      ─► code-review → fix blockers
      ─► session-wrapup (last phase: archive-spec) ─► PR ─► CI: validate + docs ─► ⛔ HUMAN MERGES
      ─► weekly-review on main ─► ⛔ milestone gate (human, with evidence)
```

Session boundaries are a feature: write the spec in one session, implement it in another, and converge with a subagent that never saw the conversation.

## 7. Tooling

| Command | What |
|---|---|
| `node scripts/validate.mjs [quick]` | validation gate; commands in `agentic.config.json` |
| `node scripts/docs-check.mjs all [--base origin/main]` | links, indexes, frontmatter, coverage, owners, AGENTS.md budget, lessons |
| `node scripts/archive-spec.mjs <slug>` | moves an implemented spec into `20-specs/implemented/` |

CI (`.github/workflows/ci.yml`) runs `validate` and `docs` on every PR. Both should be required checks on `main`. Workspace details: [[overview]].
