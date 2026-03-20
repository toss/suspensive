import type { MetaRecord } from 'nextra'

export default {
  motivation: { title: 'Motivation' },
  installation: { title: 'Installation' },
  migration: { title: 'Migration Guide' },
  '--- API Reference': {
    type: 'separator',
    title: 'API Reference',
  },
  Suspense: { title: '<Suspense/>' },
  ErrorBoundary: { title: '<ErrorBoundary/>' },
  ErrorBoundaryGroup: { title: '<ErrorBoundaryGroup/>' },
  Delay: { title: '<Delay/>' },
  ClientOnly: { title: '<ClientOnly/>' },
  DefaultPropsProvider: { title: '<DefaultPropsProvider/>' },
  lazy: { title: 'lazy' },
  useIsClient: { title: 'useIsClient' },
} satisfies MetaRecord
