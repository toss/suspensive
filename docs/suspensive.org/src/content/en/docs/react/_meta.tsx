import type { MetaRecord } from 'nextra'

export default {
  motivation: { title: 'Why need to use?' },
  installation: { title: 'Installation' },
  'migrate-to-v3': { title: 'Migrating to v3' },
  'migrate-to-v2': { title: 'Migrating to v2' },
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
  wrap: { title: 'wrap' },
} satisfies MetaRecord
