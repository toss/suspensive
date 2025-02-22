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
    title: 'Documentation',
  },
  versions: {
    type: 'menu',
    title: 'latest',
    items: {
      latest: {
        title: 'latest',
        href: 'https://suspensive.org',
      },
      v3: {
        title: 'v3',
        href: 'https://v3.suspensive.org',
      },
      v2: {
        title: 'v2',
        href: 'https://v2.suspensive.org',
      },
      v1: {
        title: 'v1',
        href: 'https://v1.suspensive.org',
      },
    },
  },
} satisfies MetaRecord
