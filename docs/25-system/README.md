# System — map

How FlowPilot is built **now**. Pages here mirror the code at building-block level and are consulted before editing anything under their `sources:` (see the handbook, `docs/README.md` § System pages).

**Current state: an empty workspace.** The repository holds the pnpm/TypeScript workspace shell, the validation gate and the docs tooling; there are no apps or packages yet. The intended shape (provisional, decided by the architecture spec in [[M1]]) is:

```
 Markdown folders / vaults  ◄──read/watch/write──►  engine (apps/engine)  ──API──►  web UI (apps/web)
                                                       │  uses
                                                       ▼
                                          domain packages (packages/*):
                                          task model · sources/sync · FVP · planning
```

Pages appear with the specs that give them content; nothing is scaffolded empty.

- [[overview]] — workspace layout, toolchain, validation gate, CI, docs tooling
