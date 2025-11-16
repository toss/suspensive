import type { MetaRecord } from '@/types/meta'
import type MetaEn from '../../../en/docs/react/_meta'

export default {
  motivation: { title: '어떤 이유로 사용하나요?' },
  installation: { title: '설치하기' },
  migration: { title: '마이그레이션 가이드' },
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
  lazy: { title: 'lazy' },
  useIsClient: { title: 'useIsClient' },
} satisfies typeof MetaEn satisfies MetaRecord
