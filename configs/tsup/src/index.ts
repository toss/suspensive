import { Options } from 'tsup'

export const options: Options = {
  banner: { js: '"use client"' },
  format: ['cjs', 'esm'],
  entry: ['src/*.ts', 'src/*.tsx', 'src/experimental/*.ts', 'src/experimental/*.tsx'],
  sourcemap: true,
  clean: true,
  dts: true,
  splitting: false,
}
