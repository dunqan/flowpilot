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
