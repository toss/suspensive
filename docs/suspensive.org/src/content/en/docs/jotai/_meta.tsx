import type { MetaRecord } from 'nextra'

export default {
  motivation: { title: 'Motivation' },
  installation: { title: 'Installation' },
  '--- API Reference': {
    type: 'separator',
    title: 'API Reference',
  },
  Atom: { title: '<Atom/>' },
  AtomValue: { title: '<AtomValue/>' },
  SetAtom: { title: '<SetAtom/>' },
} satisfies MetaRecord
