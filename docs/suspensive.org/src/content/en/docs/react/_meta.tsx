import type { MetaRecord } from 'nextra'

export default {
  motivation: { title: 'Why need to use?' },
  installation: { title: 'Installation' },
  migration: { title: 'Migration guide' },
  '--- API Reference': {
    type: 'separator',
    title: 'API Reference',
  },
  Suspense: { title: '<Suspense />' },
  ErrorBoundary: { title: '<ErrorBoundary />' },
  ErrorBoundaryGroup: { title: '<ErrorBoundaryGroup />' },
  Delay: { title: '<Delay />' },
  ClientOnly: { title: '<ClientOnly />' },
  DefaultPropsProvider: { title: '<DefaultPropsProvider />' },
} satisfies MetaRecord
