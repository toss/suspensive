import type { MetaRecord } from 'nextra'

export default {
  motivation: { title: '동기' },
  usage: { title: '사용하기' },
  '--- Codemods': {
    type: 'separator',
    title: 'Codemods',
  },
  migrateToV4: { title: 'v4로 마이그레이션' },
  tanstackQueryImport: { title: 'TanStack Query로 import 경로 변경' },
  migrateQueryClientConsumerProps: {
    title: '<QueryClientConsumer/> Props 변환',
  },
  migrateWithAPI: { title: 'with API로 변환' },
  removeNetworkmode: { title: 'networkMode 제거' },
  migrateSuspensiveReactQueryPackage: {
    title: '@suspensive/react-query 패키지 마이그레이션',
  },
} satisfies MetaRecord
