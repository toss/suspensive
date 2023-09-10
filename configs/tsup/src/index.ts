import { Options } from 'tsup'

export const options: Options = {
  banner: { js: '"use client"' },
  format: ['cjs', 'esm'],
  entry: ['{src,src/experimental}/*.{ts,tsx}', '!**/*.{spec,test,test-d}.*'],
  sourcemap: true,
  dts: true,
  splitting: false,
}
