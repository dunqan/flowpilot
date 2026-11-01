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
