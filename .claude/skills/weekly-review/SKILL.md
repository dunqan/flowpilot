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
