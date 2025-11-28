import type { MetaRecord } from 'nextra'
import type MetaEn from '../../../en/docs/react-query/_meta'

export default {
  motivation: { title: '어떤 이유로 사용하나요?' },
  installation: { title: '설치하기' },
  'tanstack-query-compatibility': {
    title: 'TanStack Query v4, 5를 모두 지원',
  },
  migration: { title: '마이그레이션 가이드' },
  '--- API Reference': {
    type: 'separator',
    title: 'API 문서',
  },
  mutationOptions: { title: 'mutationOptions' },
  usePrefetchQuery: { title: 'usePrefetchQuery' },
  usePrefetchInfiniteQuery: { title: 'usePrefetchInfiniteQuery' },
  SuspenseQuery: { title: '<SuspenseQuery/>' },
  SuspenseQueries: { title: '<SuspenseQueries/>' },
  SuspenseInfiniteQuery: { title: '<SuspenseInfiniteQuery/>' },
  Mutation: { title: '<Mutation/>' },
  PrefetchQuery: { title: '<PrefetchQuery/>' },
  PrefetchInfiniteQuery: { title: '<PrefetchInfiniteQuery/>' },
  QueriesHydration: { title: '<QueriesHydration/>' },
  QueryClientConsumer: { title: '<QueryClientConsumer/>' },
  IsFetching: { title: '<IsFetching/>' },
  getQueryClient: { title: 'getQueryClient' },
  '--- Deprecated': {
    type: 'separator',
    title: 'Deprecated',
  },
  queryOptions: { title: 'queryOptions' },
  infiniteQueryOptions: { title: 'infiniteQueryOptions' },
  useSuspenseQuery: { title: 'useSuspenseQuery' },
  useSuspenseQueries: { title: 'useSuspenseQueries' },
  useSuspenseInfiniteQuery: { title: 'useSuspenseInfiniteQuery' },
} satisfies typeof MetaEn satisfies MetaRecord
