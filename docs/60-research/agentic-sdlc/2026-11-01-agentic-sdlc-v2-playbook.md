---
type: research
status: draft
created: 2026-11-01
tags: [research, process, sdlc]
---

# Agentic SDLC v2 — drop-in playbook

> A complete, project-agnostic instruction for running a repository where **agents build from approved specs, humans hold the gates, and the documentation describes the system as it is**. Paste this file into any repo and ask an agent to execute §10 (new repo) or §11 (existing repo).

**Provenance.** v1 is the 1tap/1klik handbook (spec → run → review → wrap-up → archive, fragments, follow-ups, human-only gates). v2 adds what v1 lacked, a living technical documentation layer, and borrows the parts that proved themselves elsewhere: open-mercato (instruction budget, nested prescriptive `AGENTS.md`, tagged lessons index, pre-implementation analysis), GitHub spec-kit (`analyze` and `converge` passes, explicit spec persistence), AWS Kiro (path-scoped steering, post-task hooks), arc42 §5 (building-block cards that mirror code), Diátaxis (reference is consulted, not read; never scaffold empty), Anthropic's memory guidance (`<200` lines, hot vs cold context, "rules that must hold 100% live in hooks/CI"), and the Ma'at / Codocia doc-sync tools (`sources:` globs + evidence-carrying `verified:`).

**How to read this file.** §0–§6 are the model. §7 (skills), §8 (templates) and §9 (scripts) are the artifacts to copy verbatim. §10–§11 are procedures. Placeholders look like `<repo>`, `<app>`; everything else is literal.

---

## 0. Principles

1. **Docs are the source of truth; code follows specs.** A feature exists first as an approved spec, then as code that satisfies it, then as a system page that describes what shipped. Never in another order.
2. **Humans control gates, not keystrokes.** Humans decide at exactly five points: approving a spec, answering "Ask First" stops, merging PRs, signing off milestone gates, curating lessons. Everything between gates is delegated; nothing at a gate ever is.
3. **The repo must learn.** Every session leaves progress, a resumable run, decisions as ADRs, pitfalls as lessons, and the current state in the system pages. A session that produced code but no memory is incomplete.
4. **Hot context is tiny; cold context is addressable.** `AGENTS.md` holds only rules and routing (≤ 200 lines). Knowledge lives in small files at predictable paths, found by name, opened on demand. Unindexed knowledge is invisible; oversized files are skimmed, not followed.
5. **Rules that must hold 100% live in scripts, not prose.** Prose rules are suggestions; CI rules are guarantees. Whenever a rule has been broken twice, mechanise it.
6. **Process weight matches problem size.** A typo fix needs no spec. Over-speccing kills the system faster than under-speccing.

## 1. Repository layout

```
<repo>
├── AGENTS.md                 the constitution: rules + Task Router, ≤ 200 lines (§5)
├── CLAUDE.md                 one line: "Follow AGENTS.md." (plus tool-specific notes if any)
├── agentic.config.json       machine-readable settings read by scripts and skills (§8.9)
├── .claude/skills/           workflow skills (§7); .claude/rules/ optional path-scoped hints (§5.4)
├── .github/                  PR template (§8.8) + CI: validation gate + docs-check (§9)
├── scripts/                  docs-check.mjs, validate.mjs, archive-spec.mjs, md-to-wikilinks.mjs
├── docs/                     the vault (Obsidian-friendly, plain markdown, wikilinks)
│   ├── README.md             the handbook: this model explained for humans
│   ├── 00-vision/            why the product exists
│   ├── 10-plans/             roadmap, milestones (gates), editions
│   ├── 20-specs/             INTENT: pending specs; implemented/ archive; <slug>/spec.md + design/ for folder specs
│   ├── 25-system/            STATE: how the system is built now, mirrors the code (§3)
│   ├── 30-adr/               WHY: decisions, numbered, immutable once accepted
│   ├── 40-progress/          weekly logs + sessions/ fragments
│   ├── 50-runs/              execution plans per agent session, resumable
│   ├── 55-followups/         what implemented specs still owe (device QA, hosted smoke, review, cleanup)
│   ├── 60-research/          evidence: interviews, stats, audits, comparisons
│   ├── 70-dashboards/        Obsidian Bases over frontmatter
│   ├── 80-ops/               runbooks for hosted-side configuration
│   ├── lessons.md            MEMORY index: one row per lesson, tagged by system page
│   ├── lessons/              one record per lesson; inbox/ for proposals
│   └── templates/            one template per document type (§8)
├── apps/ backend/ packages/  code; each area may carry a local AGENTS.md (prescriptive, ≤ 80 lines)
```

Three layers, three questions: **intent** (`20-specs`, `10-plans`, `30-adr`: what should be true and why), **state** (`25-system`: what is true now), **memory** (`40-progress`, `50-runs`, `55-followups`, `lessons`: what happened and what we learned). Keep them apart: a spec never becomes the description of the current system, a system page never argues for a change, a run never debates design.

## 2. Document types

| Type | Folder | Lifecycle (`status`) | Written by | Read when |
|---|---|---|---|---|
| Spec | `20-specs/` | `draft` → `approved` (human) → `in-progress` → `implemented` (moved) | agent via `write-spec`, human approves | implementing or changing a feature |
| System page | `25-system/` | living; `verified: <date> <sha>` | agent in every phase; human reviews in PR | **before touching any area** |
| ADR | `30-adr/` | `proposed` → `accepted` (immutable) → `superseded` | agent drafts, human accepts | before any architectural choice |
| Milestone | `10-plans/milestones/` | `planned` → `active` → `done` (human checks gate criteria) | human | planning |
| Run | `50-runs/` | `active` → `paused` → `done` | agent | resuming work |
| Follow-up | `55-followups/` | bullet exists ↔ work is owed | `archive-spec` | weekly review, device/staging sessions |
| Progress | `40-progress/` | weekly file compiled from `sessions/` fragments | `session-wrapup` writes fragments; `weekly-review` compiles | "what happened while I wasn't looking" |
| Lesson | `lessons/` + `lessons.md` | proposal in `inbox/` → record (human sign-off) → promoted to `AGENTS.md`/CI or deleted | agent proposes, human curates | session start (index), per touched area (records) |
| Vision / research / ops | `00-`, `60-`, `80-` | living, no lifecycle | anyone | as routed |

### 2.1 Specs (changes vs v1)

- Sections (template §8.1): Problem · Goals/Non-goals · Design · **Touches** · **Contract surfaces** · Phases · Acceptance Criteria (Given/When/Then, AC-IDs) · Verification (AC → test) · Decisions & Alternatives · Open Questions · Changelog.
- **Touches** lists the system pages this spec will create or update (`[[page]]` per line, with "create" or "update"). It is the docs plan, approved with the test plan. A spec that touches code but lists no pages is not approvable.
- **Contract surfaces** is a product-sized backward-compatibility list: database schema & RLS, public URLs/routes, stored config schemas (anything persisted as JSON), analytics event names, i18n keys, environment/config keys, published artefacts. The spec states for each touched surface: additive / migrated / breaking (breaking → Ask First).
- **Persistence model is flow-forward.** Once `implemented`, a spec changes only in its Changelog. New behaviour gets a new spec that links the old one (`extends:` or `supersedes:` in frontmatter). The current truth lives in the system page, so specs never need to be "kept alive".
- `write-spec` produces a **skeleton with numbered Open Questions first** and stops; research and drafting continue only after answers (Kiro/open-mercato hard gate). A fresh-context subagent reviews scope cohesion before the human sees the draft (the author cannot adversarially re-read its own spec).
- Folder specs (`<slug>/spec.md` + `design/`) and binding/illustrative design assets are unchanged from v1.

### 2.2 Runs (changes vs v1)

- Filename `YYYY-MM-DD-<slug>-run.md` (phase runs: `-run-b.md`), so names never collide with specs under wikilinks.
- New sections: **Readiness** (the `analyze` result, §6 step 3) and **Converge findings** (gaps a fresh-context pass found between code and spec, appended as unchecked steps).
- Still: first commit on the branch, Progress boxes with commit SHAs, Handoff rewritten at every wrap-up, git wins over the checklist.

### 2.3 Lessons (changes vs v1)

- `docs/lessons.md` is an **index**, not a document: one row per record, `- [[slug]] — one-line rule · areas: page-a, page-b`. Agents read the index at session start (one line per lesson) and open only records whose `areas:` match the pages in the spec's Touches.
- Records live in `docs/lessons/<slug>.md` with frontmatter `areas: [<system page names>]` and `topics: [...]`; body Context → Problem → Rule → Applies to. Each record is also linked from the **Gotchas** section of the system pages it names, so the knowledge is reachable from both sides.
- Proposals go to `docs/lessons/inbox/`; `weekly-review` presents them, the human signs off per entry.
- Curation rules: record a pitfall only after an agent actually made the mistake; the index must stay the same size or shrink each quarter (merge, promote to `AGENTS.md` or CI, delete what CI now enforces); a lesson that applies everywhere is a rule and belongs in `AGENTS.md`.

### 2.4 Unchanged from v1

ADRs (one decision per file, accepted = immutable, supersede instead of edit), milestones named after outcomes with human-checked gate criteria, follow-ups grouped by how they get done and never keeping a spec open, the fragments pattern for shared append-only files, union merge only for independent bullet lists, evidence over assertion.

## 3. The system documentation tree (`docs/25-system/`)

### 3.1 What it is, what it is not

| Owns | Must not contain | Load when |
|---|---|---|
| How each building block works **now**: responsibilities, file map, mechanism, invariants, contracts, how to change it, known pitfalls, pointers to the specs/ADRs that shaped it | plans, proposals, options (→ spec); rationale and trade-offs (→ ADR); history or changelogs (→ git, spec Changelog); step-by-step session state (→ run); anything the code states just as clearly (type signatures, enum values) | before editing anything under the page's `sources:`; when answering "how does X work"; in `write-spec` research; in `code-review` |

The test for every sentence: *could an agent that reads only this page continue the work in the right place without re-deriving it from the code?* If the sentence does not help with that, cut it.

### 3.2 Shape

- **Mirrors the code at building-block level**, not file level: one page per app, per backend concern, per package or package family, plus `flows/` for end-to-end mechanisms that cross blocks (sign-up → first app, publishing a page, a payment, an analytics event's path, the deploy pipeline).
- **Depth follows risk.** Refine a block into child pages only when it is important, complex, risky or volatile (arc42). One page may own a whole family via one glob (`sources: [packages/tiles]` for twenty-four tiles, with a table), until one member deserves its own page.
- **Never scaffold empty.** A page is created in the spec phase that gives it content. No "TBD" pages, no empty folders.
- **Every folder has a `README.md` index** listing its pages as `- [[page]] — one-line summary`, with an `## Optional` section for deep pages. Unlisted pages fail CI. The root `25-system/README.md` is the map: one paragraph on the architecture, the C4 context/container picture (hand-drawn or generated from the workspace graph), links to area indexes and `flows/`.
- **Generate the "what", hand-write the "why".** Dependency graphs, route lists, schema listings are generated or linked to their generator, never hand-copied. Prose is spent on responsibilities, mechanisms, invariants and pitfalls.

Example (1tap-shaped):

```
25-system/
├── README.md                 map: apps ↔ backend ↔ packages, hosting, data flow
├── overview.md               containers, environments, build/deploy pipeline, where config lives
├── apps/README.md
├── apps/main-panel.md        the owner panel: routing, auth guards, pages, state, i18n
├── apps/pwa.md               the customer PWA: SSR, service worker, theming, install flow
├── backend/README.md
├── backend/schema.md         tables, ownership model, RLS strategy, migrations workflow
├── backend/auth.md           identity, sessions, account lifecycle
├── packages/README.md
├── packages/tiles.md         the tile contract (definition, config schema, editor/renderer loaders) + table of tiles
├── packages/shared.md        data-access, types, customer-page rendering
├── packages/design-system.md tokens, previews, publishing
└── flows/README.md
    ├── onboarding.md         sign-up → business → first published page
    ├── billing.md            plans, trial, Stripe, entitlements
    └── analytics.md          event path from tap to dashboard
```

### 3.3 Page anatomy (template §8.3)

```
---
type: system
area: apps/main-panel            # path-like id = where it sits in the tree
sources:                         # code this page owns (paths or globs, repo-relative)
  - apps/main/src
specs: [[[2026-07-06-auth-business-creation/spec]], ...]   # what shaped it (history)
adrs: [[[0007-client-side-supabase-auth]]]
verified: 2026-11-01 534eb96     # last time a human/agent checked this page against the code, with the commit
---
# <Block name>

**Purpose** — 1–3 sentences: what this block is responsible for and what it deliberately is not.
**Sits between** — callers → this → callees (one line each, link pages).

## Where
File map: the 5–15 paths that matter, each with a one-line role. Not a directory listing.

## How it works
The mechanism in present tense: the main flow, the states, the invariants that must hold, the failure modes. Diagrams only if they show a mechanism.

## Contracts
What this block exposes or depends on and must not break silently: schemas, routes, events, config keys, env vars. One line each; link the source of truth (a zod schema, a migration) rather than restating it.

## How to change it
The 3–6 common changes ("add a tile", "add a page", "add a column") as numbered steps, with the tests to run and the pages to update.

## Gotchas
- [[lesson-slug]] — one line
(only lessons that name this page in `areas:`)

## History
- [[20-specs/implemented/<slug>/spec]] — what it added · [[0007-…]] — the decision behind X
```

Writing rules: present tense; ≤ 150 lines (split by mechanism when bigger); consulted, not read, so headings are stable and scannable; code paths in backticks; link, do not repeat; no changelog; no plans; no "we decided" (link the ADR). Update `verified:` only after actually reading the code against the page, and set it to the commit you checked against; a bare date bump is a lie the checker cannot catch but a reviewer can.

### 3.4 Ownership and the check

Every source directory that holds code must be covered by at least one page's `sources:` (`docs-check coverage`). When a PR changes a source file, at least one page owning that file must change in the same PR (`docs-check owners`). Escape hatch: a line `Docs: not-needed — <reason>` in the PR body or a commit message waives the PR; the findings are still printed as warnings so the reviewer sees what was skipped. Typical legitimate waivers: pure refactor with no behaviour change, test-only change, dependency bump, typo.

Precision matters: `sources:` for an area page is that area's path; the root `overview.md` owns workspace-level files (`nx.json`, `package.json`, `.github/workflows`), not `apps/`. Broad globs make the owners check useless because any doc edit satisfies it.

### 3.5 Lifecycle

| Moment | Who | What happens to system pages |
|---|---|---|
| `write-spec` | agent | reads the pages for the affected areas (never asks the human what a page answers); fills **Touches** |
| spec approval | human | approves Touches as part of the spec |
| `implement-spec`, every phase | agent | after tests pass and before self-review: create/update the pages in Touches for what this phase shipped; bump `verified:` with the phase's commit |
| `code-review` | agent | checks: pages updated, present tense, nothing that belongs in spec/ADR, Gotchas link the lessons touched, `docs-check all` green |
| `archive-spec` | agent | confirms every page in Touches was updated; moves any "current state" knowledge still sitting in the spec Changelog into the page; the spec becomes history |
| `weekly-review` | agent + human | lint: pages whose `sources` changed since their `verified` commit (re-verify or fix), orphans, broken links, pages > 150 lines, contradictions |
| hotfix without spec | agent | still updates the owning page or waives explicitly |

### 3.6 Relationship to other knowledge

- **Local `AGENTS.md`** (in `apps/<app>/`, `packages/<pkg>/`) stays **prescriptive**: Always / Ask First / Never / Validation Commands, ≤ 80 lines, and links the system page for the description. Never duplicate: rules in `AGENTS.md`, mechanism in the page.
- **Code comments** stay for the local "why this line"; the page holds the mechanism across files. A comment may cite a page (`see docs/25-system/packages/tiles.md § Contracts`).
- **Specs** cite pages in Touches; pages cite specs in History. **ADRs** are cited from the page's frontmatter; the page never restates the rationale.
- **Lessons** name pages in `areas:`; pages list them in Gotchas. `docs-check lessons` verifies both ends exist.
- **Claude Code rules (optional).** `.claude/rules/<area>.md` with `paths: ["apps/pwa/**"]` and a two-line body: "Before editing, read `docs/25-system/apps/pwa.md`. Run `npx nx test pwa`." This is the Kiro `fileMatch` steering equivalent; it costs nothing when the path is not touched.

## 4. Links and naming

- **Wikilinks everywhere in the vault**: `[[page]]`, `[[page#Heading]]`, `[[page|label]]`. Obsidian setting: Wikilinks on, "New link format: shortest path". GitHub renders them as plain text; that is accepted.
- **Basenames are unique** across the vault except for designated index/file names (`README.md`, `spec.md`, `brief.md`, design assets). Those are linked with their vault path: `[[25-system/apps/README|Apps]]`, `[[20-specs/2026-07-17-guest-hub/spec]]`. A bare `[[spec]]` is ambiguous and fails CI. No `../` in wikilinks.
- **Moves need no link rewriting** (the reason for the switch): `archive-spec` moves a folder spec with `git mv` and only its frontmatter changes.
- Names: specs `YYYY-MM-DD-<slug>` (file or folder), runs `YYYY-MM-DD-<slug>-run`, ADRs `NNNN-<slug>`, system pages `<block>` (kebab, no dates, no numbers), lessons `<rule-as-slug>`, session fragments `YYYY-MM-DD-<branch-slug>-<sha>`.
- Code links from docs are plain backticked repo paths (`apps/main/src/account.ts`), never wikilinks.

## 5. Agent instructions

### 5.1 Root `AGENTS.md`

≤ 200 lines and ≤ 24 KiB (checked by `docs-check budget`; the 32 KiB ceiling is shared with nested files). Sections, in order: one-paragraph identity · Repo Map (table) · **Always** · **Ask First** · **Never** · **Validation Commands** (`node scripts/validate.mjs`; the list itself lives in `agentic.config.json`) · **Workflow** (the loop in 6 lines) · **Task Router** (task → read first; every row points at a system page, a folder README, or a skill). Everything long-form lives in `docs/README.md` (the handbook) or in system pages. If a rule needs a paragraph of explanation, the rule stays and the paragraph moves.

### 5.2 Nested `AGENTS.md`

Create one for an area when it develops conventions an agent would otherwise get wrong (template §8.7). Prescriptive only, ≤ 80 lines, the four boundary headings plus a "Common tasks" checklist and a link to the system page. The root→nested chain must stay under 32 KiB.

### 5.3 `CLAUDE.md`

One line that delegates to `AGENTS.md`, plus the session-start checklist (read `AGENTS.md`, read `docs/lessons.md` index, check `docs/50-runs/` for an active run). Tool-specific notes only if genuinely tool-specific.

### 5.4 `agentic.config.json`

The single home for machine-read settings: validation commands, docs paths and budgets, waiver pattern, owned directories (§8.9). Scripts and CI read it; `AGENTS.md` points at it.

## 6. The workflow loop

```
 idea ─► write-spec: research → skeleton + Open Questions ⛔ human answers → draft → cohesion review → draft ready
      ─► ⛔ HUMAN APPROVES spec (Design, ACs, Verification, Touches)
      ─► implement-spec: analyze (readiness) → branch → run file → per phase:
             implement → tests → validate → UPDATE SYSTEM PAGES → self-review → commit → tick box (sha)
             ⛔ Ask First trigger → STOP
         converge: fresh-context pass compares code with the spec → gaps appended to the run → loop until stable
      ─► code-review (checklist, incl. docs) → fix blockers
      ─► session-wrapup: run, spec changelog, fragment, lesson proposals; last phase → archive-spec
      ─► PR with Spec / Run / Pages links ─► CI: validate + docs-check ─► ⛔ HUMAN REVIEWS & MERGES
      ─► weekly-review on main: compile fragments, lessons inbox, follow-ups pulse, docs lint
      ─► ⛔ milestone gate (human, with evidence)
```

1. **Spec.** `write-spec`: read `AGENTS.md`, lessons index, the system pages of the affected areas, overlapping specs and research. Produce the skeleton (TLDR + Open Questions `Q1…Qn`, including "should this be split?") and **stop**. With answers: interview in rounds if still fuzzy, draft every section, fill Touches and Contract surfaces, promote big choices to proposed ADRs, run the fresh-context cohesion review, leave `status: draft`.
2. **Approval (human).** The highest-leverage ten minutes in the system: Design, ACs, Verification, Touches. Flip to `approved`.
3. **Analyze.** First step of `implement-spec`: cross-check AC ↔ Verification ↔ Phases ↔ Touches for orphans in any direction; read accepted ADRs and the lessons whose `areas` match Touches; list tensions with `AGENTS.md`. Write the result as the run's **Readiness** block. Any blocker → fix in the spec (with the human) before code.
4. **Implement**, phase by phase, with system pages updated inside the phase, not at the end. Ambiguity or an Ask-First trigger → run's Blocked section, stop.
5. **Converge.** After the last planned step of a phase, a subagent that never saw the conversation reads spec + code + tests and reports unmet ACs, untested paths, pages that do not describe what shipped. Findings become unchecked steps under **Converge findings**; implement; repeat until the pass adds nothing.
6. **Review.** `code-review` checklist (§7.3). Blockers fixed before the phase counts as done.
7. **Wrap-up.** `session-wrapup`; on the spec's last phase `archive-spec`. PR body links spec, run and the pages changed, or carries a `Docs: not-needed` line. Never merged by the agent.
8. **Merge (human).** CI is the enforcement layer behind every prose rule: validation gate, `docs-check all --base`, e2e.
9. **Weekly review** on `main`; **milestone gate** when a milestone's specs are implemented.

**Interrupted?** `continue-run` resumes from the first unchecked box after reconciling with `git log`. **Fresh session boundary** is a feature: write the spec in one session, implement in another, converge with a subagent; each boundary removes the author's blind spots.

## 7. Skills

Copy each block to `.claude/skills/<name>/SKILL.md` (frontmatter included). Keep each under 150 lines; move reference material to `references/`.

### 7.1 write-spec

````markdown
---
name: write-spec
description: Draft a feature specification in docs/20-specs/ from a rough idea, conversation, or research. Skeleton with Open Questions first (hard stop), then interview, draft, and a fresh-context cohesion review. Triggers on "write a spec", "spec out", "plan this feature".
---

# Write Spec

Produce a spec a future agent can implement **without asking questions**, and a docs plan (Touches) the human approves with it.

**Non-interactive mode**: on "no questions" / "just draft", or when invoked by another agent, skip steps 3–5 and 9; unknowns go to Open Questions.

## Research (before asking anything)
1. Read `AGENTS.md`, the `docs/lessons.md` index, the active milestone, and `docs/25-system/README.md`; then the system pages of every area the idea touches. Open lesson records whose `areas:` name those pages.
2. Search `docs/20-specs/` (root and `implemented/`) for overlap: propose extending or superseding (`extends:`/`supersedes:`) instead of duplicating. Check `docs/60-research/` for evidence.
3. **Never ask the human something the repo already answers.**

## Skeleton (hard gate)
4. Create the file from `docs/templates/spec.md` (folder spec if assets are expected). Write only: TLDR (3 lines), Problem, and **Open Questions** `Q1…Qn` — the unknowns whose wrong answer would rewrite the design. Always include: scope split (would each capability work without the other?), non-goals, contract surfaces that might break. One short, answerable question per line. **STOP and hand the skeleton to the human.** Do not research further or draft until every Qn has an answer (answers are recorded under Decisions & Alternatives as human-decided).

## Clarify (if still fuzzy after the skeleton)
5. Brainstorm 2–3 genuinely different approaches with trade-offs when the problem is clear but the solution is not; recommend one. Then interview in rounds with `AskUserQuestion` (≤ 4 questions, options with the recommended first): scope → behaviour/edge cases → UX/copy → rollout/verification. Choose sensible defaults instead of asking; record them as agent defaults. Stop when remaining unknowns would not change the design.

## Draft
6. Fill every section. Phases independently reviewable, each ending in a working state. ACs as Given/When/Then with IDs. Verification maps every AC to a test; every user-facing flow has an e2e happy path.
7. **Touches**: list each system page to create or update, `- update [[tiles]] — add the new tile to the table and the config contract` / `- create [[flows/refunds]]`. Every code area in Design must appear here.
8. **Contract surfaces**: for each surface the design touches (schema/RLS, routes, stored config schemas, event names, i18n keys, env keys, published artefacts): additive / migrated / breaking. Breaking → Ask First before approval.
9. Significant architectural choice → ADR draft in `docs/30-adr/` (`status: proposed`), linked from the spec.

## Review
10. Spawn a **fresh-context subagent** with only the spec path and the question: "Is the scope cohesive, is anything specified twice or contradictorily, which AC has no test, which Design area has no Touches page, what would you need to ask before implementing?" Fold findings in; unresolved ones go to Open Questions.
11. Assumption check: confirm the 2–3 riskiest inferred assumptions with the human in one `AskUserQuestion` round.
12. Leave `status: draft`. Stop. Only a human flips to `approved`.
````

### 7.2 implement-spec

````markdown
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
````

### 7.3 code-review (+ checklist)

````markdown
---
name: code-review
description: Review a diff, PR, or completed phase against the project checklist, the spec, accepted ADRs, matching lessons and the system pages. Triggers on "review this", "code review", "check this phase".
---

# Code Review

1. Read `references/review-checklist.md`, `AGENTS.md`, the spec, the system pages in its Touches, and the lesson records whose `areas:` name those pages.
2. Review the diff against: the checklist, the spec's Design and ACs, accepted ADRs, those lessons, and the pages (does the page now describe what the diff does?).
3. Verdict per finding: **blocker** (violates checklist / spec / ADR / lesson / contract surface), **should-fix**, **nit**. Blockers are fixed before the phase counts as done; re-run the validation gate after fixes.
4. Generalisable mistake → proposal `docs/lessons/inbox/<YYYY-MM-DD>-<slug>.md` (template `docs/templates/lesson.md`, with `areas:`). Never edit `docs/lessons.md` directly.
````

`references/review-checklist.md`:

```markdown
# Review Checklist — acceptance gate for every phase

## Correctness & scope
- [ ] Implements the spec: nothing missing, nothing extra; no behaviour change outside its scope
- [ ] Edge cases from Design handled; binding design assets matched
- [ ] No accepted ADR contradicted; Contract surfaces changed only as the spec states

## Quality
- [ ] Validation gate passes (`node scripts/validate.mjs`), including e2e
- [ ] Every AC in Verification maps to an implemented, passing test; user-facing flow → e2e happy path
- [ ] Regression risk addressed: named existing tests still pass
- [ ] Tests assert behaviour, not implementation; no dead code, debug output, commented blocks
- [ ] Errors handled; failure states explicit

## System documentation
- [ ] Every page in the spec's Touches updated for what shipped; `verified:` set to a commit in this branch
- [ ] Pages are present tense, ≤ 150 lines, describe mechanism/contracts/how-to-change; no plans, rationale, or history prose (links instead)
- [ ] New or changed pitfalls: lesson proposed and linked from the page's Gotchas
- [ ] `node scripts/docs-check.mjs all --base origin/main` green, or a justified `Docs: not-needed` line

## Safety & hygiene
- [ ] No secrets; no new production dependency without prior approval; no hard-coded strings where a convention exists
- [ ] Every matching lesson's Rule respected

## Process
- [ ] Run Progress has commit SHAs; Readiness and Converge findings recorded
- [ ] Spec Changelog updated (final phase) / deviations pre-approved
```

### 7.4 archive-spec

````markdown
---
name: archive-spec
description: Archive an implemented spec - AC sweep against tests, system-page sweep against Touches, leftovers to docs/55-followups/, status implemented, git mv into implemented/. Runs in the PR that lands a spec's last phase. Triggers on "archive spec", "move to implemented".
---

# Archive Spec

A spec is archived when its **code and pages** are done, not when every manual check is done. Leftovers become follow-ups; the spec moves to `implemented/` in the same PR (merge = deploy = sign-off).

## When
From `session-wrapup` on the last phase; on request for merged specs still in the root. Unimplemented phases → scope reduction → Ask First.

## Steps
1. **Confirm done**: every phase has a `done` run; no real feature work in Handoff/Blocked.
2. **AC sweep**: per unchecked AC, the Verification test exists (grep) and passed → tick; missing or `manual` → leave unticked + follow-up (`cleanup.md` for a missing test). Never tick on assertion.
3. **Page sweep**: every page in Touches exists, was changed on this branch, carries `verified:` with a branch commit, and describes the shipped behaviour. Anything in the spec's Changelog that is "current state" (how it works, contracts, defaults chosen) moves into the page; the Changelog keeps only the fact it was decided and when. A page not updated → do it now, not a follow-up.
4. **Leftovers** → `docs/55-followups/` by kind (device-qa / hosted-smoke / human-review / cleanup), one bullet each, linked to the spec's archived path and AC-ID. Unsure → ask.
5. **Changelog**: `YYYY-MM-DD — Archived (implemented). Pages: [[a]], [[b]]. Follow-ups: <n> → 55-followups/<files>`.
6. **Move**: `node scripts/archive-spec.mjs <slug>` (`git mv` into `implemented/`, flips `status: implemented`). Wikilinks need no rewriting; the script only updates `spec:` frontmatter paths in runs and verifies with `node scripts/docs-check.mjs links`.

## Rules
Follow-ups never block archiving; an unticked AC needs a follow-up; the spec stays the record of intent, the page the record of state.
````

### 7.5 session-wrapup

````markdown
---
name: session-wrapup
description: End-of-session ritual - run file, spec status, system pages verified, session fragment, lesson proposals, clean tree, PR. Triggers on "wrap up", "end session".
---

# Session Wrap-up

Never end a session without this; it is what makes the next one cheap.

1. **Run file**: Progress SHAs, Converge findings state, Handoff rewritten (not appended) to the true current state, Blocked items. `status: done` only when all boxes are ticked.
2. **Spec**: `status` and Changelog if implementation advanced. Last phase landed → run `archive-spec`.
3. **System pages**: every page touched this session has `verified:` = a commit of this branch and describes what is on the branch now (half-built behaviour is described as such, in one line, with the run linked). `node scripts/docs-check.mjs all --base origin/main` green or waived with a reason.
4. **Session fragment**: `docs/40-progress/sessions/<YYYY-MM-DD>-<branch-slug>-<short-sha>.md` — date, branch, `[[run]]`, 2–4 sentences (changed / blocked / open). Never append to the weekly file.
5. **Lessons**: a recurring-capable mistake → `docs/lessons/inbox/<YYYY-MM-DD>-<slug>.md` with `areas:` naming the pages it applies to. Never edit `docs/lessons.md`.
6. **Hygiene**: clean tree, pushed, PR opened/updated from the template (Spec, Run, Pages). Do not merge.
7. Report to the human in one short paragraph: done / blocked / needs decision.
````

### 7.6 continue-run

````markdown
---
name: continue-run
description: Resume interrupted work from a run file in docs/50-runs/. Triggers on "continue", "resume the run", "pick up where we left off".
---

# Continue Run

1. Identify the run: the file named, or the newest `status: active` run whose `branch:` matches the current branch.
2. Read: the run (Handoff, Blocked, Converge findings), the spec, `AGENTS.md`, the `docs/lessons.md` index, the system pages in Touches and the lesson records naming them.
3. Reconcile the checklist with `git log` on the branch: git wins; fix the checklist first.
4. Unresolved Blocked items needing the human → surface them and STOP.
5. Resume from the first unchecked box with the `implement-spec` per-step loop (implement → tests → validate → pages → self-review → commit → tick).
````

### 7.7 weekly-review

````markdown
---
name: weekly-review
description: On main only - compile session fragments into the weekly log, review the lessons inbox with the human, follow-ups pulse, and the docs lint (stale pages, orphans, links, budgets). Triggers on "weekly review", "compile progress".
---

# Weekly Review

Single writer for `docs/40-progress/YYYY-Www.md` and (via the human) `docs/lessons.md`. Run on `main` only.

## Progress
1. Group `docs/40-progress/sessions/*.md` by ISO week; copy each fragment verbatim under the week's **Agent session log** (create the week from the template if missing); `git mv` fragments to `sessions/archived/`.

## Lessons
2. For each `docs/lessons/inbox/*.md`: recommend accept / merge into an existing record / reject. With per-entry human sign-off: create or update the record in `docs/lessons/`, add or update its index row in `docs/lessons.md`, add the `[[slug]]` to the Gotchas of every page in its `areas:`, delete the proposal. Never bulk-accept.
3. Curation pulse (monthly): index size vs last month; propose merges, promotions to `AGENTS.md`/CI, deletions of rules CI now enforces. The index must not grow unbounded.

## Follow-ups
4. Count open bullets per `docs/55-followups/*.md`; ask which were done; done → delete the bullet, record evidence in the spec's Changelog. Flag bullets older than ~4 weeks for keep/drop.
5. Spot-check `docs/20-specs/` root for specs whose runs are all `done` but were never archived; offer `archive-spec`.

## Docs lint
6. `node scripts/docs-check.mjs all`. Then list system pages whose `sources` have commits after their `verified` commit (`git log <sha>..HEAD -- <sources>`): re-verify each (read code vs page, fix, bump `verified`) or hand the list to the human. Report pages > 150 lines, folders without README, pages not reachable from `25-system/README.md`, and any `AGENTS.md` Task Router row pointing at a missing file.

## Finish
7. Commit docs-only on `main` or as a small PR, per the human's preference. Do not merge PRs yourself.
````

### 7.8 write-system-page (new)

````markdown
---
name: write-system-page
description: Create or rewrite a page in docs/25-system/ from the code - the building-block card (purpose, where, how it works, contracts, how to change it, gotchas, history). Used by implement-spec for new areas and by the upgrade procedure to document an existing codebase. Triggers on "document this area", "write the system page for".
---

# Write System Page

A page is a **reference card consulted before editing**, not an essay. Write only what an agent could not get from the code as fast.

1. **Scope the block**: confirm the directory set it owns (`sources:`), its parent index, and whether it should instead extend an existing page (one page may own a family; split only when a member is important, complex, risky or volatile).
2. **Read the code**, not the specs: entry points, public exports, schemas, routes, migrations, tests. Use subagents for large areas; ask for structure, mechanisms, invariants, failure handling, not summaries of files.
3. **Read history** second: `git log -- <sources>`, implemented specs and ADRs that mention the paths. They go to History as links; their content is not repeated.
4. **Write from `docs/templates/system-page.md`**: Purpose (1–3 sentences, with what it is *not*), Sits between, Where (5–15 paths with roles), How it works (mechanism, states, invariants, failure modes; present tense), Contracts (one line each, link the source of truth), How to change it (3–6 numbered common changes with tests to run), Gotchas (only lesson records naming this page), History (links). ≤ 150 lines.
5. **Frontmatter**: `type: system`, `area`, precise `sources:` (no globs broader than the block), `specs`, `adrs`, `verified: <today> <HEAD sha>`.
6. **Index**: add `- [[page]] — one line` to the folder `README.md`; create the README if the folder is new and link it from the parent README with a vault path.
7. **Lessons**: for each existing lesson record that concerns this block, add the page to its `areas:` and the lesson to Gotchas.
8. `node scripts/docs-check.mjs all`. Hand the page to a human for review when documenting an existing codebase (facts an agent inferred from code are the riskiest content in the vault).
````

## 8. Templates

Copy to `docs/templates/`. Templates contain `{{date}}`-style Obsidian variables; agents replace every placeholder.

### 8.1 `spec.md`

```markdown
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
```

### 8.2 `run.md`

```markdown
---
type: run
spec: "[[<spec>]]"
branch: feat/<slug>
status: active           # active | paused | done
created: {{date}}
tags: [run]
---

# Run: <short title>

> Agent-internal execution plan. NOT a spec — design questions go back to the spec. First commit on the branch; Progress boxes carry commit SHAs.

## Goal
<!-- 1–2 sentences -->

## Readiness
<!-- analyze result: AC↔Verification↔Phases↔Touches orphans (none / list), ADR & lesson tensions, Ask-First items. -->

## Plan
<!-- Ordered steps from the spec's phases. Each phase ends with: "docs: update [[page]], [[page]]". -->

## Progress
- [ ] Step 1 — ...                 <!-- done: - [x] Step 1 — ... (abc1234) -->

## Converge findings
<!-- Appended by the converge pass; each becomes a step above when accepted. -->

## Blocked / Questions for human
-

## Handoff notes
<!-- Rewritten at every wrap-up: in flight, gotchas, files touched, where to continue. -->
```

### 8.3 `system-page.md`

```markdown
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
```

### 8.4 `system-index.md` (every `25-system/**/README.md`)

```markdown
# <Area>

<One paragraph: what this area is, in the product's words.>

- [[<page>]] — <one-line summary>
- [[<page>]] — <one-line summary>

## Optional
- [[<deep page>]] — <when you would need it>
```

### 8.5 `lesson.md` (record) and the `lessons.md` index

```markdown
---
type: lesson
areas: [<system page names this applies to>]
topics: [<kebab tags>]
created: {{date}}
---

# <Rule as a sentence>

**Context**: <where it happened>
**Problem**: <what went wrong and why it recurs>
**Rule**: <the durable, general rule>
**Applies to**: <files, layers, situations>
```

```markdown
# Lessons — index

Read this file at session start. Open a record only when its `areas` match the pages you are about to touch; never bulk-read `lessons/`.

## <area group, e.g. apps/pwa>
- [[<slug>]] — <one-line rule> · areas: <page>, <page>
```

### 8.6 `adr.md`

```markdown
---
type: adr
status: proposed         # proposed | accepted | superseded
supersedes:
created: {{date}}
tags: [adr]
---
# ADR-NNNN: <Title>
## Context
## Decision
## Consequences
## Pages affected
- [[<system page>]] — <what changes there once accepted>
```

### 8.7 Local `AGENTS.md` (per app / package)

````markdown
# <Area> — Agent Guidelines

<One imperative line: "Use this package for X; never Y.">  Description: [[<system page>]].

## Always
1. **MUST ...** — <consequence>
## Ask First
- Ask before <scope/contract-changing action>.
## Never
- Never <prohibited shortcut>.
## Validation Commands
```bash
<package-scoped commands>
```
## Common tasks
1. **Add a <thing>** — <steps>; update [[<system page>]] § How to change it.
````

### 8.8 `.github/PULL_REQUEST_TEMPLATE.md`

```markdown
## Links
- **Spec**: docs/20-specs/<file>   · **Run**: docs/50-runs/<file>   · **Milestone**: M<N>
- **System pages changed**: docs/25-system/<...>  <!-- or: `Docs: not-needed — <reason>` -->

## Summary
<!-- 2–4 sentences -->

## Verification
- [ ] Every AC in the spec's Verification table has an implemented, passing test
- [ ] e2e happy path exists for any user-facing flow touched
- [ ] `node scripts/validate.mjs` and `node scripts/docs-check.mjs all --base origin/main` pass
- [ ] Run file Progress has commit SHAs; Converge findings resolved

## Deviations from spec
<!-- None, or each with the human sign-off reference -->

## Human decisions needed
<!-- From the run's Blocked section -->
```

### 8.9 `agentic.config.json`

```json
{
  "version": 2,
  "baseBranch": "main",
  "validation": {
    "commands": ["npm run typecheck", "npm run lint", "npm run test", "npm run build", "npm run e2e"],
    "quick": ["npm run typecheck", "npm run lint", "npm run test"]
  },
  "docs": {
    "docsRoot": "docs",
    "systemRoot": "docs/25-system",
    "sourceRoots": ["apps", "backend", "packages"],
    "ownedDirs": ["apps/*", "backend/*", "packages/*", "packages/*/*"],
    "ownerIgnore": ["**/*.spec.*", "**/*.test.*", "**/*-e2e/**", "**/project.json", "**/tsconfig*.json", "**/eslint.config.*", "**/README.md", "**/AGENTS.md"],
    "lessonsIndex": "docs/lessons.md",
    "lessonsDir": "docs/lessons",
    "agentsMd": { "rootMaxBytes": 24576, "rootMaxLines": 200, "chainMaxBytes": 32768 },
    "waiverPattern": "^Docs:\\s*not-needed",
    "linkIgnore": ["^PLACEHOLDER:"],
    "linkSkipDirs": ["docs/templates"]
  }
}
```

### 8.10 CI job (GitHub Actions)

```yaml
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - name: docs-check
        env:
          DOCS_WAIVER: ${{ github.event.pull_request.body }}
        run: node scripts/docs-check.mjs all --base origin/${{ github.base_ref || 'main' }}
```

The validation gate job runs `node scripts/validate.mjs`, so the command list in `agentic.config.json` is the only copy. Make both jobs required for merge.

### 8.11 `.claude/rules/<area>.md` (optional, Claude Code)

```markdown
---
paths: ["apps/pwa/**"]
---
Before editing, read `docs/25-system/apps/pwa.md` (and its Gotchas). Validate with `npx nx run-many -t test,e2e -p pwa pwa-e2e`.
```

## 9. Scripts

Zero-dependency Node ≥ 18, copied to `scripts/`. `docs-check.mjs` and `md-to-wikilinks.mjs` were exercised against a fixture vault and against the 1tap vault before being embedded here.

### 9.1 `scripts/docs-check.mjs`

```js
#!/usr/bin/env node
// docs-check.mjs — guards the docs vault. Zero dependencies, Node >= 18.
//
//   node scripts/docs-check.mjs links              [[wikilinks]] resolve to exactly one file
//   node scripts/docs-check.mjs index              every system page is listed in its folder's README.md
//   node scripts/docs-check.mjs frontmatter        system pages carry type/sources/verified
//   node scripts/docs-check.mjs coverage           every owned code dir has a system page
//   node scripts/docs-check.mjs owners --base REF  changed source => its owning pages changed too
//   node scripts/docs-check.mjs budget             AGENTS.md chains fit the instruction budget
//   node scripts/docs-check.mjs lessons            lesson records <-> catalog index agree
//   node scripts/docs-check.mjs all [--base REF]   everything (owners only when --base given)
//
// Config: agentic.config.json at the repo root, key "docs" (all keys optional, defaults below).
// Waiver for `owners`: a line `Docs: not-needed - <reason>` in the PR body passed via
// --waiver-file FILE, in $DOCS_WAIVER, or in any commit message in BASE..HEAD.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, basename, dirname, sep } from 'node:path';
import { execSync } from 'node:child_process';

const root = process.cwd();
const cfgFile = join(root, 'agentic.config.json');
const cfg = Object.assign(
  {
    docsRoot: 'docs',
    systemRoot: 'docs/25-system',
    sourceRoots: ['apps', 'backend', 'packages'],
    ownedDirs: ['apps/*', 'backend/*', 'packages/*', 'packages/*/*'],
    ownerIgnore: ['**/*.spec.*', '**/*.test.*', '**/*-e2e/**', '**/project.json', '**/tsconfig*.json', '**/eslint.config.*', '**/README.md', '**/AGENTS.md'],
    lessonsIndex: 'docs/lessons.md',
    lessonsDir: 'docs/lessons',
    agentsMd: { rootMaxBytes: 24576, rootMaxLines: 200, chainMaxBytes: 32768 },
    waiverPattern: '^Docs:\\s*not-needed',
    linkIgnore: ['^PLACEHOLDER:'],            // [[...]] markers that are not links
    linkSkipDirs: ['docs/templates'],         // files whose [[...]] are placeholders
  },
  existsSync(cfgFile) ? JSON.parse(readFileSync(cfgFile, 'utf8')).docs ?? {} : {},
);

const args = process.argv.slice(2);
const cmd = args[0] ?? 'all';
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const findings = [];
const fail = (check, file, msg) => findings.push({ check, file, msg });
const posix = (p) => p.split(sep).join('/');
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === 'dist') continue;
    const p = join(dir, e.name);
    e.isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
}
const mdFiles = (dir) => walk(join(root, dir)).filter((f) => f.endsWith('.md')).map((f) => posix(relative(root, f)));
const read = (f) => readFileSync(join(root, f), 'utf8').replace(/\r\n/g, '\n');
const stripFences = (s) => s.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');

function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const fm = {}; let key = null;
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([\w-]+):\s*(.*)$/);
    if (kv) {
      key = kv[1]; const v = kv[2].trim();
      if (v === '') fm[key] = [];
      else if (v.startsWith('[')) fm[key] = v.slice(1, -1).split(',').map((x) => x.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
      else fm[key] = v.replace(/^["']|["']$/g, '');
    } else if (key && /^\s+-\s+/.test(line)) {
      if (!Array.isArray(fm[key])) fm[key] = [];
      fm[key].push(line.replace(/^\s+-\s+/, '').trim().replace(/^["']|["']$/g, ''));
    }
  }
  return fm;
}

function globToRegex(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') { re += '.*'; i++; if (glob[i + 1] === '/') i++; }
      else re += '[^/]*';
    } else if (c === '?') re += '[^/]';
    else re += escapeRe(c);
  }
  return new RegExp(`^${re}$`);
}
const matches = (globs, path) => globs.some((g) => globToRegex(g).test(path));

// ---------- links ----------
function checkLinks() {
  const files = mdFiles(cfg.docsRoot);
  const byName = new Map();
  for (const f of files) { const n = basename(f, '.md'); byName.set(n, [...(byName.get(n) ?? []), f]); }
  const ignore = cfg.linkIgnore.map((p) => new RegExp(p));
  for (const f of files) {
    if (cfg.linkSkipDirs.some((d) => f.startsWith(d + '/'))) continue;
    const text = stripFences(read(f));
    for (const m of text.matchAll(/!?\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|[^\]]*)?\]\]/g)) {
      const raw = m[1].trim();
      if (ignore.some((re) => re.test(raw))) continue;
      const path = raw.replace(/\.md$/, '');
      const name = path.split('/').pop();
      if (path.includes('/')) {
        // Path-qualified link: resolves like Obsidian, by unique path suffix from the vault root.
        if (path.startsWith('.')) { fail('links', f, `[[${raw}]] uses a relative path; wikilinks are vault paths or bare names`); continue; }
        const hits = files.filter((p) => p === `${cfg.docsRoot}/${path}.md` || p.endsWith(`/${path}.md`));
        if (hits.length !== 1) fail('links', f, `${hits.length ? 'ambiguous' : 'unresolved'} [[${raw}]]`);
        continue;
      }
      const hits = byName.get(name) ?? [];
      if (hits.length === 0) fail('links', f, `unresolved [[${raw}]]`);
      else if (hits.length > 1) fail('links', f, `ambiguous [[${raw}]] (${hits.length} files share the name) - link it with a vault path, e.g. [[${hits[0].replace(`${cfg.docsRoot}/`, '').replace(/\.md$/, '')}]]`);
    }
  }
}

// ---------- system pages ----------
const systemPages = () => mdFiles(cfg.systemRoot).filter((f) => basename(f) !== 'README.md');

function checkIndex() {
  for (const f of systemPages()) {
    const idx = posix(join(dirname(f), 'README.md'));
    if (!existsSync(join(root, idx))) { fail('index', f, 'folder has no README.md index'); continue; }
    const name = escapeRe(basename(f, '.md'));
    if (!new RegExp(`\\[\\[(?:[^\\]|#]*/)?${name}(?:[#|][^\\]]*)?\\]\\]`).test(read(idx))) fail('index', f, `not listed in ${idx}`);
  }
}

function checkFrontmatter() {
  for (const f of systemPages()) {
    const fm = frontmatter(read(f));
    if (!fm) { fail('frontmatter', f, 'missing frontmatter'); continue; }
    if (fm.type !== 'system') fail('frontmatter', f, 'type must be "system"');
    if (!Array.isArray(fm.sources) || fm.sources.length === 0) fail('frontmatter', f, '`sources:` must list at least one path or glob');
    if (!fm.verified || !/^\d{4}-\d{2}-\d{2}\s+[0-9a-f]{7,40}$/.test(String(fm.verified))) fail('frontmatter', f, '`verified:` must be "<YYYY-MM-DD> <commit-sha>"');
  }
}

function ownersMap() {
  const map = [];
  for (const f of systemPages()) {
    const fm = frontmatter(read(f));
    if (fm && Array.isArray(fm.sources)) map.push({ page: f, globs: fm.sources.map((g) => g.replace(/\/$/, '')) });
  }
  return map;
}
const ownersOf = (map, path) => map
  .filter((o) => o.globs.some((g) => globToRegex(g).test(path) || (!/[*?]/.test(g) && path.startsWith(g + '/'))))
  .map((o) => o.page);

function expandDirPattern(pattern) {
  let frontier = [''];
  for (const part of pattern.split('/')) {
    const next = [];
    for (const base of frontier) {
      const abs = join(root, base);
      if (!existsSync(abs) || !statSync(abs).isDirectory()) continue;
      if (part === '*') { for (const e of readdirSync(abs, { withFileTypes: true })) if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules') next.push(posix(join(base, e.name))); }
      else next.push(posix(join(base, part)));
    }
    frontier = next;
  }
  return frontier.filter((d) => existsSync(join(root, d)) && statSync(join(root, d)).isDirectory());
}

function checkCoverage() {
  const map = ownersMap();
  const dirs = new Set(cfg.ownedDirs.flatMap(expandDirPattern));
  for (const d of dirs) {
    if (matches(cfg.ownerIgnore, d) || matches(cfg.ownerIgnore, d + '/x')) continue;
    const hasCode = walk(join(root, d)).some((f) => /\.(ts|tsx|mts|js|mjs|sql|html|scss|css|toml|jsonc?)$/.test(f) && !/\.(spec|test)\./.test(f));
    if (!hasCode) continue;
    if (ownersOf(map, d + '/x').length === 0) fail('coverage', d, 'no system page lists this directory in `sources:`');
  }
}

function checkOwners(base) {
  const diff = execSync(`git diff --name-only ${base}...HEAD`, { encoding: 'utf8' }).split('\n').filter(Boolean).map(posix);
  const changedSrc = diff.filter((p) => cfg.sourceRoots.some((r) => p.startsWith(r + '/')) && !matches(cfg.ownerIgnore, p));
  const changedDocs = new Set(diff.filter((p) => p.startsWith(cfg.systemRoot + '/')));
  const map = ownersMap();
  const waiverRe = new RegExp(cfg.waiverPattern, 'mi');
  const bodies = [
    opt('--waiver-file') ? readFileSync(opt('--waiver-file'), 'utf8') : '',
    process.env.DOCS_WAIVER ?? '',
    execSync(`git log --format=%B ${base}..HEAD`, { encoding: 'utf8' }),
  ];
  const waived = bodies.some((b) => waiverRe.test(b));
  const stale = new Map(); const unowned = [];
  for (const src of changedSrc) {
    const owners = ownersOf(map, src);
    if (owners.length === 0) { unowned.push(src); continue; }
    if (!owners.some((o) => changedDocs.has(o))) for (const o of owners) stale.set(o, [...(stale.get(o) ?? []), src]);
  }
  const level = waived ? 'owners (waived)' : 'owners';
  for (const [page, srcs] of stale) fail(level, page, `source changed, page not updated: ${srcs.slice(0, 5).join(', ')}${srcs.length > 5 ? ` (+${srcs.length - 5})` : ''}`);
  for (const src of unowned) fail(level, src, 'changed source has no owning system page');
  if (waived && (stale.size || unowned.length)) console.log('owners: findings waived by a "Docs: not-needed" line.');
}

// ---------- AGENTS.md budget ----------
function checkBudget() {
  const b = cfg.agentsMd;
  const rootFile = 'AGENTS.md';
  if (!existsSync(join(root, rootFile))) return;
  const rootText = read(rootFile); const rootBytes = Buffer.byteLength(rootText);
  if (rootBytes > b.rootMaxBytes) fail('budget', rootFile, `${rootBytes} bytes > ${b.rootMaxBytes}`);
  const lines = rootText.split('\n').length;
  if (lines > b.rootMaxLines) fail('budget', rootFile, `${lines} lines > ${b.rootMaxLines}`);
  for (const f of walk(root).filter((f) => basename(f) === 'AGENTS.md' && posix(relative(root, f)) !== rootFile)) {
    const rel = posix(relative(root, f));
    let chain = rootBytes; let dir = dirname(rel);
    while (dir && dir !== '.') { const p = join(dir, 'AGENTS.md'); if (existsSync(join(root, p))) chain += Buffer.byteLength(read(p)); dir = dirname(dir); }
    if (chain > b.chainMaxBytes) fail('budget', rel, `root-to-here AGENTS.md chain is ${chain} bytes > ${b.chainMaxBytes}`);
  }
}

// ---------- lessons ----------
function checkLessons() {
  if (!existsSync(join(root, cfg.lessonsIndex))) return;
  const index = read(cfg.lessonsIndex);
  const records = mdFiles(cfg.lessonsDir).filter((f) => !f.includes('/inbox/') && basename(f) !== 'README.md');
  const all = new Set(mdFiles(cfg.docsRoot).map((f) => basename(f, '.md')));
  for (const f of records) {
    const slug = basename(f, '.md');
    if (!new RegExp(`\\[\\[${escapeRe(slug)}(?:[|#][^\\]]*)?\\]\\]`).test(index)) fail('lessons', f, `record not listed in ${cfg.lessonsIndex}`);
    const fm = frontmatter(read(f));
    if (!fm || !Array.isArray(fm.areas) || fm.areas.length === 0) fail('lessons', f, 'record needs frontmatter `areas:` (system page names it applies to)');
    else for (const a of fm.areas) if (!all.has(a)) fail('lessons', f, `areas: [[${a}]] is not a page in the vault`);
  }
  for (const m of stripFences(index).matchAll(/\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]/g)) {
    const t = m[1].trim().split('/').pop();
    if (!all.has(t)) fail('lessons', cfg.lessonsIndex, `index points at missing page [[${t}]]`);
  }
}

// ---------- run ----------
const base = opt('--base');
const run = { links: checkLinks, index: checkIndex, frontmatter: checkFrontmatter, coverage: checkCoverage, budget: checkBudget, lessons: checkLessons };
if (cmd === 'all') { Object.values(run).forEach((f) => f()); if (base) checkOwners(base); }
else if (cmd === 'owners') { if (!base) { console.error('owners needs --base <ref>'); process.exit(2); } checkOwners(base); }
else if (run[cmd]) run[cmd]();
else { console.error(`unknown command "${cmd}"`); process.exit(2); }

const hard = findings.filter((f) => !f.check.endsWith('(waived)'));
for (const f of findings) console.log(`${hard.includes(f) ? 'FAIL' : 'warn'} [${f.check}] ${f.file}: ${f.msg}`);
console.log(`docs-check ${cmd}: ${hard.length} problem(s)${findings.length - hard.length ? `, ${findings.length - hard.length} waived` : ''}.`);
process.exit(hard.length ? 1 : 0);
```

### 9.2 `scripts/validate.mjs`

```js
#!/usr/bin/env node
// validate.mjs — runs the validation gate from agentic.config.json (`validation.commands`), in order.
//   node scripts/validate.mjs            all commands
//   node scripts/validate.mjs quick      only commands tagged "quick" (validation.quick)
// AGENTS.md and CI both call this, so the command list has exactly one home.
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const cfg = JSON.parse(readFileSync('agentic.config.json', 'utf8'));
const set = process.argv[2] === 'quick' ? cfg.validation.quick ?? cfg.validation.commands : cfg.validation.commands;
for (const cmd of set) {
  console.log(`\n$ ${cmd}`);
  try { execSync(cmd, { stdio: 'inherit' }); }
  catch { console.error(`\nvalidation failed at: ${cmd}`); process.exit(1); }
}
console.log('\nvalidation: all commands passed.');
```

### 9.3 `scripts/md-to-wikilinks.mjs` (one-off migration helper)

```js
#!/usr/bin/env node
// md-to-wikilinks.mjs — one-off migration: relative markdown links -> wikilinks across a docs vault.
//   node scripts/md-to-wikilinks.mjs [--root docs] [--write]
// Without --write it only reports. Converts `[text](path/to/page.md#frag)` into
// `[[page#frag|text]]` when the basename is unique in the vault, else `[[vault/path/page#frag|text]]`.
// Leaves alone: external links, images, links to non-.md files, links inside code fences, and
// `[[...]]` that already exist. Review the diff: a link whose target is missing is reported, not changed.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative, basename, dirname, resolve, sep } from 'node:path';

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const docsRoot = opt('--root', 'docs');
const write = args.includes('--write');
const posix = (p) => p.split(sep).join('/');

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue;
    const p = join(dir, e.name);
    e.isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
}
const files = walk(docsRoot).filter((f) => f.endsWith('.md'));
const byName = new Map();
for (const f of files) { const n = basename(f, '.md'); byName.set(n, [...(byName.get(n) ?? []), posix(f)]); }

let changed = 0, converted = 0, missing = 0;
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const parts = src.split(/(```[\s\S]*?```)/); // keep fences verbatim
  let out = '';
  for (const part of parts) {
    if (part.startsWith('```')) { out += part; continue; }
    out += part.replace(/(!?)\[([^\]]*)\]\(([^)\s]+?)(#[^)]*)?\)/g, (m, bang, text, href, frag = '') => {
      if (bang || /^[a-z]+:/i.test(href) || !href.endsWith('.md')) return m;
      const targetAbs = resolve(dirname(f), decodeURIComponent(href));
      if (!existsSync(targetAbs)) { missing++; console.log(`missing  ${posix(relative(process.cwd(), f))} -> ${href}`); return m; }
      const name = basename(targetAbs, '.md');
      const vaultPath = posix(relative(docsRoot, targetAbs)).replace(/\.md$/, '');
      const target = (byName.get(name)?.length ?? 0) > 1 ? vaultPath : name;
      const label = text && text !== name && text !== href ? `|${text}` : '';
      converted++;
      return `[[${target}${frag}${label}]]`;
    });
  }
  if (out !== src) { changed++; if (write) writeFileSync(f, out); }
}
console.log(`${write ? 'rewrote' : 'would rewrite'} ${changed} file(s), ${converted} link(s); ${missing} link(s) point at missing files and were left as they are.`);
```

`archive-spec.mjs` (v1) keeps `git mv` + status flip; drop its link rewriting and make it update `spec:` frontmatter in runs and run `docs-check links` afterwards.

## 10. Bootstrap a new repository

Ordered; an agent can execute this with the human present for steps 1, 6 and 9.

1. **Interview the human** (≤ 2 rounds): product in one paragraph, stack and hosting, validation commands, the first milestone's outcome, what "done" must prove. Write `docs/00-vision/vision.md` and `docs/10-plans/milestones/M1.md`.
2. **Create the layout** from §1 and copy templates (§8), skills (§7), scripts (§9), `agentic.config.json` (§8.9 with the real commands), PR template (§8.8), CI jobs (§8.10). Obsidian: Wikilinks on, shortest path.
3. **Write `AGENTS.md`** from §5.1: rules from this playbook's §0, repo map, validation via `scripts/validate.mjs`, the six-line workflow, a Task Router with rows for every folder and skill. ≤ 200 lines. `CLAUDE.md` delegates.
4. **Write `docs/README.md`** (the handbook) by adapting §0–§6 of this file to the project's words. Link it from `AGENTS.md`.
5. **ADR-0001** "Record architecture decisions"; **ADR-0002+** for the stack choices made in step 1.
6. **Seed `25-system/`** with `README.md` (the map, even if it describes an empty workspace) and `overview.md` (containers, environments, pipeline) with `sources:` pointing at workspace files. Nothing else: pages appear with the specs that give them content. Human reviews.
7. **Seed `lessons.md`** as an empty index with the header text (§8.5). No records yet.
8. Run `node scripts/docs-check.mjs all` → green. Commit.
9. **First spec** via `write-spec`; approval; `implement-spec`. The first phase creates the first real system pages and proves the loop end to end.

## 11. Upgrade an existing repository (v1 → v2)

Do this as a spec of its own (`write-spec` → approve → `implement-spec`), one phase per numbered item, so the migration is reviewed like any change. Expect two to four sessions for a repo of ~40 implemented specs.

1. **Inventory and config.** Add `agentic.config.json` with the real validation commands, `scripts/validate.mjs`, `scripts/docs-check.mjs`; wire the CI jobs with the owners check **advisory** (`continue-on-error: true`) until step 6. Point `AGENTS.md` Validation Commands at `validate.mjs`.
2. **Links.** `node scripts/md-to-wikilinks.mjs` (dry run) → review the missing-target report (pre-existing dead links: fix or drop) → `--write`. Then `docs-check links`: resolve ambiguous names by path-qualifying the link (`[[20-specs/implemented/<slug>]]`) and rename runs to `-run.md` so spec and run names no longer collide. Obsidian: switch to wikilinks. Simplify `archive-spec.mjs` (no more link rewriting). Add link-ignore patterns for intentional non-link markers (legal placeholders).
3. **Lessons.** Split the monolithic `lessons.md`: one record per entry in `docs/lessons/<slug>.md` with `areas:` (system page names decided in step 4; use the planned names), `lessons.md` becomes the index. Merge overlapping entries while splitting; delete rules CI already enforces. Human signs the final index.
4. **System pages, area by area.** Plan the tree (§3.2) from `docs-check coverage` output: one page per app, per backend concern, per package or family, plus the 3–6 flows that cross them. For each area run `write-system-page` (code first, history second), one PR per area or per two areas, **human-reviewed**: inferred facts are the risk. Set `verified:` to the reviewed commit. Add Gotchas ↔ `areas:` links for existing lessons. Add a Task Router row `Before touching <area>: [[page]]`.
5. **Specs and skills.** Replace the skills with §7, the templates with §8. Add `Touches` and `Contract surfaces` to the spec template; pending `approved`/`in-progress` specs get a Touches section before their next phase (agent drafts, human confirms). Implemented specs are not edited (flow-forward); their "current state" knowledge was harvested into pages in step 4.
6. **Make it blocking.** When `docs-check coverage` is green, remove `continue-on-error`; `owners` now fails PRs without a page update or a waiver. Add the PR template line.
7. **Shrink `AGENTS.md`** to rules + routing (≤ 200 lines); move explanations to the handbook or pages. Write nested `AGENTS.md` only where an area has conventions agents got wrong (check the lessons index for clusters).
8. **Handbook.** Rewrite `docs/README.md` sections for system pages, lessons, links and the loop. Update dashboards (`type == "system"` view: pages sorted by `verified`, pages whose area has an active run).
9. **First weekly-review in v2**: run the docs lint, record the baseline (pages, stale pages, index size) in the progress log so the next quarter can see whether the system learns.

## 12. Anti-patterns

- **Pages that narrate.** "We decided…", "In July we added…": that is a spec or an ADR. Pages state what is.
- **Pages that mirror directories.** A page per folder regardless of risk produces fifty stubs no one reads. Depth follows risk.
- **Broad `sources:`.** `sources: [apps]` on the overview makes every PR "covered". Own precisely.
- **Date-bump verification.** `verified:` without reading the code against the page is worse than a stale date: it hides the staleness.
- **Living specs.** Editing implemented specs to match the code recreates the problem pages solve, in a place with no ownership check. Flow-forward: new spec, link the old one.
- **Bulk-reading lessons.** The index exists so the records are not loaded. An agent that opens all records has defeated the budget.
- **Prose where a check belongs.** A rule broken twice gets a script, a lint or a hook; the prose shrinks accordingly.
- **Waiver as habit.** `Docs: not-needed` on a feature PR is a review blocker, not a convenience. Reviewers read the warnings the waiver suppressed.
- **Speccing everything / skipping wrap-up / editing accepted ADRs / runs as specs** — unchanged from v1, still fatal.

## Appendix — sources consulted

open-mercato `AGENTS.md`, `.ai/docs/agent-instructions.md`, `.ai/lessons.md`, `om-spec-writing`, `om-pre-implement-spec`, `om-implement-spec`, `om-create-agents-md` (github.com/open-mercato/open-mercato) · GitHub spec-kit, agentic SDD and spec persistence (github.github.io/spec-kit) · AWS Kiro specs, steering, hooks (kiro.dev/docs) · BMAD `bmad-project-context` · Agent OS v3 standards index · Cline Memory Bank · Cursor rules · Anthropic: Claude Code memory, best practices, skills; "Effective context engineering for AI agents" · agents.md and issue #135 · Diátaxis reference and workflow · arc42 §5 Building Block View · C4 model · llms.txt · Ma'at, Codocia, TheYgent PR #93 (per-module AGENTS.md map check), Diew/living-docs, "Living Architecture", Karpathy's LLM-wiki pattern, arXiv 2607.04576 (progressive disclosure ablation), doc-drift CI post (understandingdata), Microsoft hve-core freshness linter.
