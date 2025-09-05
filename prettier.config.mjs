/** @type {import("prettier").Config} */
export default {
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
  overrides: [{ files: 'packages/*/src/index.ts', options: { plugins: ['prettier-plugin-sort-re-exports'] } }],
}
