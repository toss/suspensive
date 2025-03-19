import type { MetaRecord } from 'nextra'
import type MetaEn from '../../../en/docs/react/_meta'

export default {
  motivation: { title: '어떤 이유로 사용하나요?' },
  installation: { title: '설치하기' },
  'migrate-to-v3': { title: 'v3로 마이그레이션하기' },
  'migrate-to-v2': { title: 'v2로 마이그레이션하기' },
  '--- API Reference': {
    type: 'separator',
    title: 'API 문서',
  },
  Suspense: { title: '<Suspense/>' },
  ErrorBoundary: { title: '<ErrorBoundary/>' },
  ErrorBoundaryGroup: { title: '<ErrorBoundaryGroup/>' },
  Delay: { title: '<Delay/>' },
  ClientOnly: { title: '<ClientOnly/>' },
  DefaultPropsProvider: { title: '<DefaultPropsProvider/>' },
} satisfies typeof MetaEn satisfies MetaRecord
