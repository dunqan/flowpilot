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
