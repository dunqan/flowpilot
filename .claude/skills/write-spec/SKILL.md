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
