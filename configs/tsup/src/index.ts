import { Options } from 'tsup'

export const options: Options = {
  banner: { js: '"use client"' },
  format: ['cjs', 'esm'],
  entry: ['src/index.ts'],
  sourcemap: true,
  clean: true,
  dts: true,
}
