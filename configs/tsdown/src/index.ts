import type { Options } from 'tsdown'

export const options: Options = {
  banner: { js: '"use client"' },
  format: ['cjs', 'esm'],
  target: ['chrome51', 'firefox53', 'edge18', 'safari11', 'ios11', 'opera38', 'es6', 'node14'],
  entry: ['src/**/*.{ts,tsx}', '!**/*.{spec,test,test-d}.*', '!**/test-utils/**/*'],
  outDir: 'dist',
  sourcemap: true,
  minify: false,
  dts: true,
  attw: true,
  publint: true,
  clean: true,
}

export const scriptOptions: Options = {
  format: 'cjs',
  target: ['node18'],
  entry: ['src/bin/*.{ts,tsx}', '!**/*.{spec,test,test-d}.*'],
  outDir: 'dist/bin',
  attw: true,
  publint: true,
  clean: true,
}
