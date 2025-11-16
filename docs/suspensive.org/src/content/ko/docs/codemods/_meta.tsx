import type { MetaRecord } from '@/types/meta'

export default {
  motivation: { title: '어떤 이유로 사용하나요?' },
  usage: { title: '사용하기' },
  '--- Codemods': {
    type: 'separator',
    title: 'Codemods',
  },
  tanstackQueryImport: { title: 'TanStack Query로 import 경로 변경' },
  migrateQueryClientConsumerProps: {
    title: '<QueryClientConsumer/> Props 변환',
  },
  migrateWithAPI: { title: 'with API로 변환' },
  removeNetworkmode: { title: 'networkMode 제거' },
} satisfies MetaRecord
