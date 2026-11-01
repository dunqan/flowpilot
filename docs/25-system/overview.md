---
type: system
area: overview
sources:
  - package.json
  - pnpm-workspace.yaml
  - pnpm-lock.yaml
  - tsconfig.base.json
  - eslint.config.mjs
  - vitest.config.ts
  - agentic.config.json
  - scripts
  - .github
specs: []
adrs: [0001-record-architecture-decisions, 0002-pnpm-typescript-workspace]
verified: 2026-11-01 7d960f5
tags: [system]
---

# Workspace overview

**Purpose** — The repository-level machinery: workspace layout, toolchain, the validation gate, CI, and the scripts that guard the docs vault. It does not describe product behaviour; that lives in area pages once apps and packages exist.
**Sits between** — developers, agents and CI → this → every app and package (through `pnpm -r`).

## Where
- `package.json` — root scripts (`typecheck`, `lint`, `test`, `build`, `validate`, `docs:check`); dev-only toolchain; `packageManager` pins pnpm.
- `pnpm-workspace.yaml` — workspace members: `apps/*`, `packages/*`.
- `tsconfig.base.json` — strict TypeScript settings every package extends.
- `eslint.config.mjs` — flat config for the whole repo (`docs/` ignored); a `scripts/` override allows ternary statements.
- `vitest.config.ts` — root test run; picks up `{apps,packages}/*/{src,test}/**/*.test.ts`.
- `agentic.config.json` — the single home for validation commands and docs-check settings.
- `scripts/validate.mjs` — runs `validation.commands` (or `validation.quick` with `quick`) in order, stopping at the first failure.
- `scripts/docs-check.mjs` — vault checks: `links`, `index`, `frontmatter`, `coverage`, `owners --base`, `budget`, `lessons`, `all`.
- `scripts/archive-spec.mjs` — moves an implemented spec into `docs/20-specs/implemented/`, flips its status, fixes run `spec:` links.
- `scripts/md-to-wikilinks.mjs` — one-off converter from relative Markdown links to wikilinks.
- `.github/workflows/ci.yml` — the `validate` and `docs` jobs; `.github/PULL_REQUEST_TEMPLATE.md` — PR links and checks.

## How it works
- **Validation gate.** `node scripts/validate.mjs` reads `agentic.config.json` and runs `pnpm run typecheck`, `lint`, `test`, `build`. `typecheck` and `build` fan out with `pnpm -r --if-present`, so a package joins the gate by defining those scripts; with no packages they print "No projects matched" and pass. `test` runs Vitest once at the root with `--passWithNoTests`.
- **CI.** On every PR and push to `main`: `validate` installs with `pnpm install --frozen-lockfile` and runs the gate; `docs` runs `docs-check all --base origin/<base>` with the PR body in `DOCS_WAIVER`, so a `Docs: not-needed — <reason>` line downgrades `owners` findings to warnings.
- **Docs ownership.** `coverage` requires every `apps/*` and `packages/*` directory with code to be named in some system page's `sources:`; `owners` requires a PR that changes files under `apps/` or `packages/` to change an owning page too. Root files (this page's `sources:`) are not under `sourceRoots`, so `owners` does not enforce them; keep this page current by review.
- **Vault.** `docs/` is an Obsidian vault (`docs/.obsidian/app.json`: wikilinks, shortest path). `docs/templates/` and `docs/60-research/agentic-sdlc/` are excluded from link checks because they contain placeholder links.

## Contracts
- `agentic.config.json` `validation.commands` / `validation.quick` — read by `validate.mjs`, CI and every skill; change the gate only here.
- `agentic.config.json` `docs.*` — read by `docs-check.mjs` and `archive-spec.mjs` (`docsRoot`).
- Package script names `typecheck`, `build`, `test` — the root gate depends on them.
- TypeScript pinned to `~6.0.3` — bound by typescript-eslint and Angular support ([[0002-pnpm-typescript-workspace]]).
- Waiver line `^Docs:\s*not-needed` — PR body or commit message.

## How to change it
1. **Add an app or package** — create `apps/<name>` or `packages/<name>` with a `package.json` (`typecheck`, `build`, optional `test`) and a `tsconfig.json` extending `../../tsconfig.base.json`; run `pnpm install`; create its system page in the same PR (`write-system-page`) and list it in [[25-system/README|the map]]; `node scripts/docs-check.mjs coverage`.
2. **Change the validation gate** — edit `validation` in `agentic.config.json` only; run `node scripts/validate.mjs`; update this page § How it works.
3. **Add a dev tool** — `pnpm add -Dw <pkg>`; wire it through a root script; production dependencies need human approval (AGENTS.md § Ask First).
4. **Change a docs check** — edit `scripts/docs-check.mjs` or `agentic.config.json` `docs`; run `node scripts/docs-check.mjs all`; update the handbook if the rule changes.
5. **Make CI checks required** — GitHub branch protection on `main` requires `validate` and `docs` (a human repository setting).

## Gotchas
(none yet)

## History
- [[0001-record-architecture-decisions]] — the process this repo runs on
- [[0002-pnpm-typescript-workspace]] — the workspace shell and toolchain
