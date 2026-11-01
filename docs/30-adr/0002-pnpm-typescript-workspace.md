---
type: adr
status: accepted
supersedes:
created: 2026-11-01
tags: [adr]
---
# ADR-0002: A pnpm + TypeScript monorepo shell, frameworks deferred

## Context
The concept ([[flowpilot-concept]] §8) favours a Node.js/TypeScript engine plus a browser UI, and leaves frameworks, database, parser, watcher, API style and packaging to an architecture spec. The SDLC needs a working validation gate from day one, before that spec exists. Angular is the leading UI candidate.

## Decision
- One repository with **pnpm workspaces**: deployable programs in `apps/*` (engine service, web UI), libraries in `packages/*` (domain logic kept independent of any UI).
- **TypeScript** everywhere: strict, `NodeNext` modules, shared `tsconfig.base.json`. Pinned to the 6.0 line (`~6.0.3`), because that is what typescript-eslint supports and what Angular 22 requires (`>=6.0 <6.1`).
- Root toolchain: ESLint 10 flat config with typescript-eslint, Vitest 5 (also accepted by Angular's unit-test builder), Node 24.
- The validation gate is `pnpm run typecheck | lint | test | build`; typecheck and build delegate to packages via `pnpm -r --if-present`. The command list lives in `agentic.config.json`.
- **Not decided here:** UI framework, engine framework, database, Markdown parser, file watcher, API style, packaging. These belong to the architecture spec and its ADRs. An Angular app would live in `apps/web` with its own `angular.json` and per-package scripts that the root gate picks up.

Accepted by the human in the bootstrap interview, 2026-11-01.

## Consequences
- Every package exposes `typecheck` and `build` scripts, and tests either match the root Vitest include or run through the package's own `test` script.
- Moving TypeScript beyond 6.0 waits until typescript-eslint and the chosen UI framework both support it.
- A toolchain that insists on owning the whole workspace (e.g. a full Nx or Angular-CLI-root setup) would supersede this ADR.

## Pages affected
- [[overview]] — workspace layout, toolchain, validation gate.
