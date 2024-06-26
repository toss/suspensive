import type { Options } from 'tsup'

export const options: Options = {
  clean: true,
  banner: { js: '"use client"' },
  format: ['cjs', 'esm'],
  target: ['chrome51', 'firefox53', 'edge18', 'safari11', 'ios11', 'opera38', 'es6', 'node14'],
  entry: ['src/*.{ts,tsx}', '!**/*.{spec,test,test-d,bench}.*'],
  outDir: 'dist',
  sourcemap: true,
  dts: true,
}

export const scriptOptions: Options = {
  clean: true,
  format: ['cjs'],
  target: ['chrome51', 'firefox53', 'edge18', 'safari11', 'ios11', 'opera38', 'es6', 'node14'],
  entry: ['src/scripts/**/*.{ts,tsx}', '!**/*.{spec,test,test-d,bench}.*'],
  outDir: 'dist/scripts',
  sourcemap: true,
}
