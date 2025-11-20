import { map as enMap } from '@/content/en/.map'
import { map as koMap } from '@/content/ko/.map'
import { createMDXSource, defaultSchemas } from 'fumadocs-mdx'
import { loader } from 'fumadocs-core/source'

export const enSource = loader({
  baseUrl: '/docs',
  source: createMDXSource(enMap, {
    schema: {
      frontmatter: defaultSchemas.frontmatter,
    },
  }),
})

export const koSource = loader({
  baseUrl: '/docs',
  source: createMDXSource(koMap, {
    schema: {
      frontmatter: defaultSchemas.frontmatter,
    },
  }),
})

export function getSource(lang: string) {
  return lang === 'ko' ? koSource : enSource
}
