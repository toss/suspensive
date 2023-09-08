import { Options } from 'tsup'

export const options: Options = {
  banner: { js: '"use client"' },
  format: ['cjs', 'esm'],
  entry: ['src/index.ts', 'src/*.ts', 'src/*.tsx'],
  sourcemap: true,
  dts: true,
  splitting: false,
}
