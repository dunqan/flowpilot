#!/usr/bin/env node
// archive-spec.mjs — moves an implemented spec into docs/20-specs/implemented/. Zero dependencies, Node >= 18.
//
//   node scripts/archive-spec.mjs <slug> [--dry-run]
//
// <slug> is the spec's file or folder name without extension, e.g. 2026-11-05-source-registry.
// Steps: `git mv` the file spec (<slug>.md) or folder spec (<slug>/) into implemented/, flip its
// frontmatter `status:` to `implemented`, rewrite path-qualified `spec:` frontmatter in runs
// (`[[20-specs/<slug>...]]` -> `[[20-specs/implemented/<slug>...]]`), then run `docs-check links`.
// Bare wikilinks need no rewriting (basenames are unique); body links are never touched.

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const root = process.cwd();
const cfgFile = join(root, 'agentic.config.json');
const docsRoot = (existsSync(cfgFile) && JSON.parse(readFileSync(cfgFile, 'utf8')).docs?.docsRoot) || 'docs';
const specsDir = join(docsRoot, '20-specs');
const runsDir = join(docsRoot, '50-runs');

const args = process.argv.slice(2);
const dry = args.includes('--dry-run');
const slug = args.find((a) => !a.startsWith('--'))?.replace(/\.md$/, '').replace(/\/$/, '');
if (!slug) { console.error('usage: node scripts/archive-spec.mjs <slug> [--dry-run]'); process.exit(2); }

const fileSpec = join(specsDir, `${slug}.md`);
const folderSpec = join(specsDir, slug);
let from, to, specFile;
if (existsSync(fileSpec)) { from = fileSpec; to = join(specsDir, 'implemented', `${slug}.md`); specFile = to; }
else if (existsSync(folderSpec) && statSync(folderSpec).isDirectory()) { from = folderSpec; to = join(specsDir, 'implemented', slug); specFile = join(to, 'spec.md'); }
else { console.error(`no spec "${slug}" in ${specsDir} (looked for ${slug}.md and ${slug}/)`); process.exit(1); }
if (existsSync(to)) { console.error(`${to} already exists`); process.exit(1); }

const sh = (c) => { console.log(`$ ${c}`); if (!dry) execSync(c, { stdio: 'inherit' }); };
const posix = (p) => p.replace(/\\/g, '/');

// 1. move
if (!dry) execSync(`git ls-files --error-unmatch "${posix(from)}"`, { stdio: 'ignore' });
sh(`git mv "${posix(from)}" "${posix(to)}"`);

// 2. status flip
const flipStatus = (text) => text.replace(/^(---\r?\n[\s\S]*?^status:)[^\r\n]*/m, '$1 implemented');
if (!dry) {
  const text = readFileSync(specFile, 'utf8');
  const next = flipStatus(text);
  if (next === text && !/^status:\s*implemented/m.test(text)) console.warn(`warn: no frontmatter status: in ${specFile}`);
  writeFileSync(specFile, next);
}
console.log(`status: implemented -> ${posix(specFile)}`);

// 3. run frontmatter
const linkRe = new RegExp(`(\\[\\[)20-specs/${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=[/|#\\]])`, 'g');
if (existsSync(runsDir)) {
  for (const f of readdirSync(runsDir).filter((n) => n.endsWith('.md'))) {
    const p = join(runsDir, f);
    const text = readFileSync(p, 'utf8');
    const fm = text.match(/^---\r?\n[\s\S]*?\r?\n---/);
    if (!fm) continue;
    const newFm = fm[0].replace(/^spec:.*$/m, (line) => line.replace(linkRe, `$120-specs/implemented/${slug}`));
    if (newFm !== fm[0]) {
      console.log(`spec: link updated -> ${posix(p)}`);
      if (!dry) writeFileSync(p, newFm + text.slice(fm[0].length));
    }
  }
}

// 4. verify
sh('node scripts/docs-check.mjs links');
