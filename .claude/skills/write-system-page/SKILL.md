---
name: write-system-page
description: Create or rewrite a page in docs/25-system/ from the code - the building-block card (purpose, where, how it works, contracts, how to change it, gotchas, history). Used by implement-spec for new areas and by the upgrade procedure to document an existing codebase. Triggers on "document this area", "write the system page for".
---

# Write System Page

A page is a **reference card consulted before editing**, not an essay. Write only what an agent could not get from the code as fast.

1. **Scope the block**: confirm the directory set it owns (`sources:`), its parent index, and whether it should instead extend an existing page (one page may own a family; split only when a member is important, complex, risky or volatile).
2. **Read the code**, not the specs: entry points, public exports, schemas, routes, migrations, tests. Use subagents for large areas; ask for structure, mechanisms, invariants, failure handling, not summaries of files.
3. **Read history** second: `git log -- <sources>`, implemented specs and ADRs that mention the paths. They go to History as links; their content is not repeated.
4. **Write from `docs/templates/system-page.md`**: Purpose (1–3 sentences, with what it is *not*), Sits between, Where (5–15 paths with roles), How it works (mechanism, states, invariants, failure modes; present tense), Contracts (one line each, link the source of truth), How to change it (3–6 numbered common changes with tests to run), Gotchas (only lesson records naming this page), History (links). ≤ 150 lines.
5. **Frontmatter**: `type: system`, `area`, precise `sources:` (no globs broader than the block), `specs`, `adrs`, `verified: <today> <HEAD sha>`.
6. **Index**: add `- [[page]] — one line` to the folder `README.md`; create the README if the folder is new and link it from the parent README with a vault path.
7. **Lessons**: for each existing lesson record that concerns this block, add the page to its `areas:` and the lesson to Gotchas.
8. `node scripts/docs-check.mjs all`. Hand the page to a human for review when documenting an existing codebase (facts an agent inferred from code are the riskiest content in the vault).
