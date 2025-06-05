import type { MetaRecord } from 'nextra'

export default {
  motivation: { title: '어떤 이유로 사용하나요?' },
  installation: { title: '설치하기' },
  '--- API Reference': {
    type: 'separator',
    title: 'API 문서',
  },
  Atom: { title: '<Atom />' },
  AtomValue: { title: '<AtomValue />' },
  SetAtom: { title: '<SetAtom />' },
} satisfies MetaRecord
