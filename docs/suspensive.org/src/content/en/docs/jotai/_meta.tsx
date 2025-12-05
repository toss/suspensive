import type { MetaRecord } from 'nextra'

export default {
  motivation: { title: 'Why need to use?' },
  installation: { title: 'Installation' },
  '--- API Reference': {
    type: 'separator',
    title: 'API Reference',
  },
  Atom: { title: '<Atom/>' },
  AtomValue: { title: '<AtomValue/>' },
  HydrateAtoms: { title: '<HydrateAtoms/>' },
  SetAtom: { title: '<SetAtom/>' },
} satisfies MetaRecord
