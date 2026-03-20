import { defineConfig } from 'oxfmt'

export default defineConfig({
  arrowParens: 'always',
  bracketSameLine: false,
  bracketSpacing: true,
  endOfLine: 'lf',
  jsxSingleQuote: false,
  printWidth: 120,
  proseWrap: 'preserve',
  quoteProps: 'as-needed',
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  sortPackageJson: false,
  sortTailwindcss: {
    attributes: ['class', 'className'],
    functions: ['clsx'],
    preserveWhitespace: true,
  },
  ignorePatterns: [
    'packages/codemods/src/transforms/testfixtures/**',
    'pnpm-lock.yaml',
    '**/.next',
    '**/coverage',
    '**/dist',
    '**/tsconfig.vitest-temp.json',
    'packages/**/tsup.config.bundled*.mjs',
    '.changeset/*.md',
    'packages/**/CHANGELOG.md',
    '**/*/next-env.d.ts',
  ],
})
