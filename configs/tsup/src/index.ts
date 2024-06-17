import type { Options } from 'tsup'

export const options: Options = {
  banner: { js: '"use client"' },
  format: ['cjs', 'esm'],
  target: ['chrome51', 'firefox53', 'edge18', 'safari11', 'ios11', 'opera38', 'es6', 'node14'],
  entry: ['src/*.{ts,tsx}', '!**/*.{spec,test,test-d,bench}.*'],
  sourcemap: true,
  dts: true,
}
