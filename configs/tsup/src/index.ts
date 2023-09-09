import { Options } from 'tsup'

export const options: Options = {
  banner: { js: '"use client"' },
  format: ['cjs', 'esm'],
  entry: [
    'src/*.{ts,tsx}',
    '!src/*.{spec,test,test-d}.*',
    'src/experimental/*.{ts,tsx}',
    '!src/experimental/*.{spec,test,test-d}.*',
  ],
  sourcemap: true,
  dts: true,
  splitting: false,
}
