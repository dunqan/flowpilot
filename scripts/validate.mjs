#!/usr/bin/env node
// validate.mjs — runs the validation gate from agentic.config.json (`validation.commands`), in order.
//   node scripts/validate.mjs            all commands
//   node scripts/validate.mjs quick      only commands tagged "quick" (validation.quick)
// AGENTS.md and CI both call this, so the command list has exactly one home.
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const cfg = JSON.parse(readFileSync('agentic.config.json', 'utf8'));
const set = process.argv[2] === 'quick' ? cfg.validation.quick ?? cfg.validation.commands : cfg.validation.commands;
for (const cmd of set) {
  console.log(`\n$ ${cmd}`);
  try { execSync(cmd, { stdio: 'inherit' }); }
  catch { console.error(`\nvalidation failed at: ${cmd}`); process.exit(1); }
}
console.log('\nvalidation: all commands passed.');
