import type { MetaRecord } from 'nextra'

export default {
  motivation: { title: 'Motivation' },
  usage: { title: 'Usage' },
  '--- Codemods': {
    type: 'separator',
    title: 'Codemods',
  },
  migrateToV4: { title: 'Migrate to v4' },
  tanstackQueryImport: { title: 'Migrate TanStack Query imports' },
  migrateQueryClientConsumerProps: {
    title: 'Migrate <QueryClientConsumer/> Props',
  },
  migrateWithAPI: { title: 'Migrate with API' },
  removeNetworkmode: { title: 'Remove NetworkMode' },
  migrateSuspensiveReactQueryPackage: {
    title: 'Migrate @suspensive/react-query Package',
  },
} satisfies MetaRecord
