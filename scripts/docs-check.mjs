#!/usr/bin/env node
// docs-check.mjs — guards the docs vault. Zero dependencies, Node >= 18.
//
//   node scripts/docs-check.mjs links              [[wikilinks]] resolve to exactly one file
//   node scripts/docs-check.mjs index              every system page is listed in its folder's README.md
//   node scripts/docs-check.mjs frontmatter        system pages carry type/sources/verified
//   node scripts/docs-check.mjs coverage           every owned code dir has a system page
//   node scripts/docs-check.mjs owners --base REF  changed source => its owning pages changed too
//   node scripts/docs-check.mjs budget             AGENTS.md chains fit the instruction budget
//   node scripts/docs-check.mjs lessons            lesson records <-> catalog index agree
//   node scripts/docs-check.mjs all [--base REF]   everything (owners only when --base given)
//
// Config: agentic.config.json at the repo root, key "docs" (all keys optional, defaults below).
// Waiver for `owners`: a line `Docs: not-needed - <reason>` in the PR body passed via
// --waiver-file FILE, in $DOCS_WAIVER, or in any commit message in BASE..HEAD.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, basename, dirname, sep } from 'node:path';
import { execSync } from 'node:child_process';

const root = process.cwd();
const cfgFile = join(root, 'agentic.config.json');
const cfg = Object.assign(
  {
    docsRoot: 'docs',
    systemRoot: 'docs/25-system',
    sourceRoots: ['apps', 'backend', 'packages'],
    ownedDirs: ['apps/*', 'backend/*', 'packages/*', 'packages/*/*'],
    ownerIgnore: ['**/*.spec.*', '**/*.test.*', '**/*-e2e/**', '**/project.json', '**/tsconfig*.json', '**/eslint.config.*', '**/README.md', '**/AGENTS.md'],
    lessonsIndex: 'docs/lessons.md',
    lessonsDir: 'docs/lessons',
    agentsMd: { rootMaxBytes: 24576, rootMaxLines: 200, chainMaxBytes: 32768 },
    waiverPattern: '^Docs:\\s*not-needed',
    linkIgnore: ['^PLACEHOLDER:'],            // [[...]] markers that are not links
    linkSkipDirs: ['docs/templates'],         // files whose [[...]] are placeholders
  },
  existsSync(cfgFile) ? JSON.parse(readFileSync(cfgFile, 'utf8')).docs ?? {} : {},
);

const args = process.argv.slice(2);
const cmd = args[0] ?? 'all';
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const findings = [];
const fail = (check, file, msg) => findings.push({ check, file, msg });
const posix = (p) => p.split(sep).join('/');
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === 'dist') continue;
    const p = join(dir, e.name);
    e.isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
}
const mdFiles = (dir) => walk(join(root, dir)).filter((f) => f.endsWith('.md')).map((f) => posix(relative(root, f)));
const read = (f) => readFileSync(join(root, f), 'utf8').replace(/\r\n/g, '\n');
const stripFences = (s) => s.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');

function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const fm = {}; let key = null;
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([\w-]+):\s*(.*)$/);
    if (kv) {
      key = kv[1]; const v = kv[2].trim();
      if (v === '') fm[key] = [];
      else if (v.startsWith('[')) fm[key] = v.slice(1, -1).split(',').map((x) => x.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
      else fm[key] = v.replace(/^["']|["']$/g, '');
    } else if (key && /^\s+-\s+/.test(line)) {
      if (!Array.isArray(fm[key])) fm[key] = [];
      fm[key].push(line.replace(/^\s+-\s+/, '').trim().replace(/^["']|["']$/g, ''));
    }
  }
  return fm;
}

function globToRegex(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') { re += '.*'; i++; if (glob[i + 1] === '/') i++; }
      else re += '[^/]*';
    } else if (c === '?') re += '[^/]';
    else re += escapeRe(c);
  }
  return new RegExp(`^${re}$`);
}
const matches = (globs, path) => globs.some((g) => globToRegex(g).test(path));

// ---------- links ----------
function checkLinks() {
  const files = mdFiles(cfg.docsRoot);
  const byName = new Map();
  for (const f of files) { const n = basename(f, '.md'); byName.set(n, [...(byName.get(n) ?? []), f]); }
  const ignore = cfg.linkIgnore.map((p) => new RegExp(p));
  for (const f of files) {
    if (cfg.linkSkipDirs.some((d) => f.startsWith(d + '/'))) continue;
    const text = stripFences(read(f));
    for (const m of text.matchAll(/!?\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|[^\]]*)?\]\]/g)) {
      const raw = m[1].trim();
      if (ignore.some((re) => re.test(raw))) continue;
      const path = raw.replace(/\.md$/, '');
      const name = path.split('/').pop();
      if (path.includes('/')) {
        // Path-qualified link: resolves like Obsidian, by unique path suffix from the vault root.
        if (path.startsWith('.')) { fail('links', f, `[[${raw}]] uses a relative path; wikilinks are vault paths or bare names`); continue; }
        const hits = files.filter((p) => p === `${cfg.docsRoot}/${path}.md` || p.endsWith(`/${path}.md`));
        if (hits.length !== 1) fail('links', f, `${hits.length ? 'ambiguous' : 'unresolved'} [[${raw}]]`);
        continue;
      }
      const hits = byName.get(name) ?? [];
      if (hits.length === 0) fail('links', f, `unresolved [[${raw}]]`);
      else if (hits.length > 1) fail('links', f, `ambiguous [[${raw}]] (${hits.length} files share the name) - link it with a vault path, e.g. [[${hits[0].replace(`${cfg.docsRoot}/`, '').replace(/\.md$/, '')}]]`);
    }
  }
}

// ---------- system pages ----------
const systemPages = () => mdFiles(cfg.systemRoot).filter((f) => basename(f) !== 'README.md');

function checkIndex() {
  for (const f of systemPages()) {
    const idx = posix(join(dirname(f), 'README.md'));
    if (!existsSync(join(root, idx))) { fail('index', f, 'folder has no README.md index'); continue; }
    const name = escapeRe(basename(f, '.md'));
    if (!new RegExp(`\\[\\[(?:[^\\]|#]*/)?${name}(?:[#|][^\\]]*)?\\]\\]`).test(read(idx))) fail('index', f, `not listed in ${idx}`);
  }
}

function checkFrontmatter() {
  for (const f of systemPages()) {
    const fm = frontmatter(read(f));
    if (!fm) { fail('frontmatter', f, 'missing frontmatter'); continue; }
    if (fm.type !== 'system') fail('frontmatter', f, 'type must be "system"');
    if (!Array.isArray(fm.sources) || fm.sources.length === 0) fail('frontmatter', f, '`sources:` must list at least one path or glob');
    if (!fm.verified || !/^\d{4}-\d{2}-\d{2}\s+[0-9a-f]{7,40}$/.test(String(fm.verified))) fail('frontmatter', f, '`verified:` must be "<YYYY-MM-DD> <commit-sha>"');
  }
}

function ownersMap() {
  const map = [];
  for (const f of systemPages()) {
    const fm = frontmatter(read(f));
    if (fm && Array.isArray(fm.sources)) map.push({ page: f, globs: fm.sources.map((g) => g.replace(/\/$/, '')) });
  }
  return map;
}
const ownersOf = (map, path) => map
  .filter((o) => o.globs.some((g) => globToRegex(g).test(path) || (!/[*?]/.test(g) && path.startsWith(g + '/'))))
  .map((o) => o.page);

function expandDirPattern(pattern) {
  let frontier = [''];
  for (const part of pattern.split('/')) {
    const next = [];
    for (const base of frontier) {
      const abs = join(root, base);
      if (!existsSync(abs) || !statSync(abs).isDirectory()) continue;
      if (part === '*') { for (const e of readdirSync(abs, { withFileTypes: true })) if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules') next.push(posix(join(base, e.name))); }
      else next.push(posix(join(base, part)));
    }
    frontier = next;
  }
  return frontier.filter((d) => existsSync(join(root, d)) && statSync(join(root, d)).isDirectory());
}

function checkCoverage() {
  const map = ownersMap();
  const dirs = new Set(cfg.ownedDirs.flatMap(expandDirPattern));
  for (const d of dirs) {
    if (matches(cfg.ownerIgnore, d) || matches(cfg.ownerIgnore, d + '/x')) continue;
    const hasCode = walk(join(root, d)).some((f) => /\.(ts|tsx|mts|js|mjs|sql|html|scss|css|toml|jsonc?)$/.test(f) && !/\.(spec|test)\./.test(f));
    if (!hasCode) continue;
    if (ownersOf(map, d + '/x').length === 0) fail('coverage', d, 'no system page lists this directory in `sources:`');
  }
}

function checkOwners(base) {
  const diff = execSync(`git diff --name-only ${base}...HEAD`, { encoding: 'utf8' }).split('\n').filter(Boolean).map(posix);
  const changedSrc = diff.filter((p) => cfg.sourceRoots.some((r) => p.startsWith(r + '/')) && !matches(cfg.ownerIgnore, p));
  const changedDocs = new Set(diff.filter((p) => p.startsWith(cfg.systemRoot + '/')));
  const map = ownersMap();
  const waiverRe = new RegExp(cfg.waiverPattern, 'mi');
  const bodies = [
    opt('--waiver-file') ? readFileSync(opt('--waiver-file'), 'utf8') : '',
    process.env.DOCS_WAIVER ?? '',
    execSync(`git log --format=%B ${base}..HEAD`, { encoding: 'utf8' }),
  ];
  const waived = bodies.some((b) => waiverRe.test(b));
  const stale = new Map(); const unowned = [];
  for (const src of changedSrc) {
    const owners = ownersOf(map, src);
    if (owners.length === 0) { unowned.push(src); continue; }
    if (!owners.some((o) => changedDocs.has(o))) for (const o of owners) stale.set(o, [...(stale.get(o) ?? []), src]);
  }
  const level = waived ? 'owners (waived)' : 'owners';
  for (const [page, srcs] of stale) fail(level, page, `source changed, page not updated: ${srcs.slice(0, 5).join(', ')}${srcs.length > 5 ? ` (+${srcs.length - 5})` : ''}`);
  for (const src of unowned) fail(level, src, 'changed source has no owning system page');
  if (waived && (stale.size || unowned.length)) console.log('owners: findings waived by a "Docs: not-needed" line.');
}

// ---------- AGENTS.md budget ----------
function checkBudget() {
  const b = cfg.agentsMd;
  const rootFile = 'AGENTS.md';
  if (!existsSync(join(root, rootFile))) return;
  const rootText = read(rootFile); const rootBytes = Buffer.byteLength(rootText);
  if (rootBytes > b.rootMaxBytes) fail('budget', rootFile, `${rootBytes} bytes > ${b.rootMaxBytes}`);
  const lines = rootText.split('\n').length;
  if (lines > b.rootMaxLines) fail('budget', rootFile, `${lines} lines > ${b.rootMaxLines}`);
  for (const f of walk(root).filter((f) => basename(f) === 'AGENTS.md' && posix(relative(root, f)) !== rootFile)) {
    const rel = posix(relative(root, f));
    let chain = rootBytes; let dir = dirname(rel);
    while (dir && dir !== '.') { const p = join(dir, 'AGENTS.md'); if (existsSync(join(root, p))) chain += Buffer.byteLength(read(p)); dir = dirname(dir); }
    if (chain > b.chainMaxBytes) fail('budget', rel, `root-to-here AGENTS.md chain is ${chain} bytes > ${b.chainMaxBytes}`);
  }
}

// ---------- lessons ----------
function checkLessons() {
  if (!existsSync(join(root, cfg.lessonsIndex))) return;
  const index = read(cfg.lessonsIndex);
  const records = mdFiles(cfg.lessonsDir).filter((f) => !f.includes('/inbox/') && basename(f) !== 'README.md');
  const all = new Set(mdFiles(cfg.docsRoot).map((f) => basename(f, '.md')));
  for (const f of records) {
    const slug = basename(f, '.md');
    if (!new RegExp(`\\[\\[${escapeRe(slug)}(?:[|#][^\\]]*)?\\]\\]`).test(index)) fail('lessons', f, `record not listed in ${cfg.lessonsIndex}`);
    const fm = frontmatter(read(f));
    if (!fm || !Array.isArray(fm.areas) || fm.areas.length === 0) fail('lessons', f, 'record needs frontmatter `areas:` (system page names it applies to)');
    else for (const a of fm.areas) if (!all.has(a)) fail('lessons', f, `areas: [[${a}]] is not a page in the vault`);
  }
  for (const m of stripFences(index).matchAll(/\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]/g)) {
    const t = m[1].trim().split('/').pop();
    if (!all.has(t)) fail('lessons', cfg.lessonsIndex, `index points at missing page [[${t}]]`);
  }
}

// ---------- run ----------
const base = opt('--base');
const run = { links: checkLinks, index: checkIndex, frontmatter: checkFrontmatter, coverage: checkCoverage, budget: checkBudget, lessons: checkLessons };
if (cmd === 'all') { Object.values(run).forEach((f) => f()); if (base) checkOwners(base); }
else if (cmd === 'owners') { if (!base) { console.error('owners needs --base <ref>'); process.exit(2); } checkOwners(base); }
else if (run[cmd]) run[cmd]();
else { console.error(`unknown command "${cmd}"`); process.exit(2); }

const hard = findings.filter((f) => !f.check.endsWith('(waived)'));
for (const f of findings) console.log(`${hard.includes(f) ? 'FAIL' : 'warn'} [${f.check}] ${f.file}: ${f.msg}`);
console.log(`docs-check ${cmd}: ${hard.length} problem(s)${findings.length - hard.length ? `, ${findings.length - hard.length} waived` : ''}.`);
process.exit(hard.length ? 1 : 0);
