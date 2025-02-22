import type { MetaRecord } from 'nextra'

export default {
  index: {
    type: 'page',
    display: 'hidden',
    theme: {
      layout: 'full',
    },
  },
  docs: {
    type: 'page',
    title: '문서보기',
  },
  versions: {
    type: 'menu',
    title: 'latest',
    items: {
      latest: {
        title: 'latest',
        href: 'https://suspensive.org/ko',
      },
      v3: {
        title: 'v3 (WIP)',
        href: 'https://v3.suspensive.org',
      },
      v2: {
        title: 'v2',
        href: 'https://v2.suspensive.org/ko',
      },
      v1: {
        title: 'v1',
        href: 'https://v1.suspensive.org/ko',
      },
    },
  },
} satisfies MetaRecord
