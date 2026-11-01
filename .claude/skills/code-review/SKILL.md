---
name: code-review
description: Review a diff, PR, or completed phase against the project checklist, the spec, accepted ADRs, matching lessons and the system pages. Triggers on "review this", "code review", "check this phase".
---

# Code Review

1. Read `references/review-checklist.md`, `AGENTS.md`, the spec, the system pages in its Touches, and the lesson records whose `areas:` name those pages.
2. Review the diff against: the checklist, the spec's Design and ACs, accepted ADRs, those lessons, and the pages (does the page now describe what the diff does?).
3. Verdict per finding: **blocker** (violates checklist / spec / ADR / lesson / contract surface), **should-fix**, **nit**. Blockers are fixed before the phase counts as done; re-run the validation gate after fixes.
4. Generalisable mistake → proposal `docs/lessons/inbox/<YYYY-MM-DD>-<slug>.md` (template `docs/templates/lesson.md`, with `areas:`). Never edit `docs/lessons.md` directly.
