import type { Options } from 'tsup'

export const options: Options = {
  banner: { js: '"use client"' },
  format: ['cjs', 'esm'],
  // target: ['chrome51', 'es6', 'safari11', 'deno1', 'edge18', 'firefox53', 'node12'],
  entry: ['src/*.{ts,tsx}', '!**/*.{spec,test,test-d}.*'],
  sourcemap: true,
  dts: true,
  splitting: false,
}
