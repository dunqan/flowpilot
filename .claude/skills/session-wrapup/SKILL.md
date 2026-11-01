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
