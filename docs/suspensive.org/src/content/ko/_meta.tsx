import type { MetaRecord } from 'nextra'

export default {
  index: {
    type: 'page',
    display: 'hidden',
    theme: {
      copyPage: false,
      layout: 'full',
      toc: false,
    },
  },
  docs: {
    type: 'page',
    title: '문서',
  },
  'getting-started': {
    type: 'page',
    title: '시작하기',
    href: '/docs/react/getting-started',
  },
  compare: {
    type: 'page',
    title: '비교',
    href: '/docs/react/comparison',
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
        title: 'v3',
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
