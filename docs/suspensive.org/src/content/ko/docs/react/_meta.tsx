import type { MetaRecord } from 'nextra'
import type MetaEn from '../../../en/docs/react/_meta'

export default {
  motivation: { title: '동기' },
  installation: { title: '설치하기' },
  'getting-started': { title: '시작하기' },
  comparison: { title: 'Suspensive vs react-error-boundary' },
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
  '--- More': {
    type: 'separator',
    title: '더보기',
  },
  migration: { title: '마이그레이션 가이드' },
} satisfies typeof MetaEn satisfies MetaRecord
