import { createMDXSource } from 'fumadocs-mdx'
import { loader } from 'fumadocs-core/source'

export const source = loader({
  baseUrl: '/docs',
  source: createMDXSource({
    files: './src/content/**/*.mdx',
  }),
})
