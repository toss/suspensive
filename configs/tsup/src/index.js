/** @type {import('tsup').Options} */
export const options = {
  banner: { js: '"use client"' },
  format: ['cjs', 'esm'],
  entry: ['src/*.{ts,tsx}', '!**/*.{spec,test,test-d}.*'],
  sourcemap: true,
  dts: true,
  splitting: false,
}
