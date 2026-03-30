import type { MetaRecord } from 'nextra'

export default {
  motivation: { title: 'Motivation' },
  installation: { title: 'Installation' },
  'getting-started': { title: 'Getting Started' },
  comparison: { title: 'Suspensive vs Other Error Boundary Libraries' },
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
  '--- More': {
    type: 'separator',
    title: 'More',
  },
  migration: { title: 'Migration Guide' },
} satisfies MetaRecord
