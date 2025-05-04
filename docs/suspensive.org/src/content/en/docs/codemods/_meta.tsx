import type { MetaRecord } from 'nextra'

export default {
  motivation: { title: 'Why need to use?' },
  usage: { title: 'Usage' },
  '--- Codemods': {
    type: 'separator',
    title: 'Codemods',
  },
  tanstackQueryImport: { title: 'Migrate TanStack Query imports' },
  migrateQueryClientConsumerProps: {
    title: 'Migrate <QueryClientConsumer/> Props',
  },
  migrateWithAPI: { title: 'Migrate with API' },
} satisfies MetaRecord
