#!/usr/bin/env node
// md-to-wikilinks.mjs — one-off migration: relative markdown links -> wikilinks across a docs vault.
//   node scripts/md-to-wikilinks.mjs [--root docs] [--write]
// Without --write it only reports. Converts `[text](path/to/page.md#frag)` into
// `[[page#frag|text]]` when the basename is unique in the vault, else `[[vault/path/page#frag|text]]`.
// Leaves alone: external links, images, links to non-.md files, links inside code fences, and
// `[[...]]` that already exist. Review the diff: a link whose target is missing is reported, not changed.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative, basename, dirname, resolve, sep } from 'node:path';

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const docsRoot = opt('--root', 'docs');
const write = args.includes('--write');
const posix = (p) => p.split(sep).join('/');

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue;
    const p = join(dir, e.name);
    e.isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
}
const files = walk(docsRoot).filter((f) => f.endsWith('.md'));
const byName = new Map();
for (const f of files) { const n = basename(f, '.md'); byName.set(n, [...(byName.get(n) ?? []), posix(f)]); }

let changed = 0, converted = 0, missing = 0;
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const parts = src.split(/(```[\s\S]*?```)/); // keep fences verbatim
  let out = '';
  for (const part of parts) {
    if (part.startsWith('```')) { out += part; continue; }
    out += part.replace(/(!?)\[([^\]]*)\]\(([^)\s]+?)(#[^)]*)?\)/g, (m, bang, text, href, frag = '') => {
      if (bang || /^[a-z]+:/i.test(href) || !href.endsWith('.md')) return m;
      const targetAbs = resolve(dirname(f), decodeURIComponent(href));
      if (!existsSync(targetAbs)) { missing++; console.log(`missing  ${posix(relative(process.cwd(), f))} -> ${href}`); return m; }
      const name = basename(targetAbs, '.md');
      const vaultPath = posix(relative(docsRoot, targetAbs)).replace(/\.md$/, '');
      const target = (byName.get(name)?.length ?? 0) > 1 ? vaultPath : name;
      const label = text && text !== name && text !== href ? `|${text}` : '';
      converted++;
      return `[[${target}${frag}${label}]]`;
    });
  }
  if (out !== src) { changed++; if (write) writeFileSync(f, out); }
}
console.log(`${write ? 'rewrote' : 'would rewrite'} ${changed} file(s), ${converted} link(s); ${missing} link(s) point at missing files and were left as they are.`);
