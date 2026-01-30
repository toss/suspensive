import type { MetaRecord } from 'nextra'
import type MetaEn from '../../../en/docs/react-query/_meta'

export default {
  motivation: { title: '어떤 이유로 사용하나요?' },
  installation: { title: '설치하기' },
  migration: { title: '마이그레이션 가이드' },
  '--- API Reference': {
    type: 'separator',
    title: 'API 문서',
  },
  createGetQueryClient: { title: 'createGetQueryClient' },
  mutationOptions: { title: 'mutationOptions' },
  SuspenseQuery: { title: '<SuspenseQuery/>' },
  SuspenseQueries: { title: '<SuspenseQueries/>' },
  SuspenseInfiniteQuery: { title: '<SuspenseInfiniteQuery/>' },
  Mutation: { title: '<Mutation/>' },
  PrefetchQuery: { title: '<PrefetchQuery/>' },
  PrefetchInfiniteQuery: { title: '<PrefetchInfiniteQuery/>' },
  QueriesHydration: { title: '<QueriesHydration/>' },
  QueryClientConsumer: { title: '<QueryClientConsumer/>' },
  IsFetching: { title: '<IsFetching/>' },
} satisfies typeof MetaEn satisfies MetaRecord
