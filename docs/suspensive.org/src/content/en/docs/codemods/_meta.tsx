import type { MetaRecord } from 'nextra'

export default {
  motivation: { title: 'Why need to use?' },
  usage: { title: 'Usage' },
  '--- Codemods': {
    type: 'separator',
    title: 'Codemods',
  },
  tanstackQueryImport: { title: 'Migrate TanStack Query imports' },
} satisfies MetaRecord
