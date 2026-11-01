import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  { ignores: ['**/dist/**', '**/coverage/**', '**/node_modules/**', 'docs/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { languageOptions: { globals: { ...globals.node } } },
  {
    // scripts/ are copied verbatim from the agentic SDLC playbook; they use ternaries as statements.
    files: ['scripts/**/*.mjs'],
    rules: { '@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true }] },
  },
);
