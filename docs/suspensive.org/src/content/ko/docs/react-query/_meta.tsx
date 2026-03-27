import type { MetaRecord } from 'nextra'
import type MetaEn from '../../../en/docs/react-query/_meta'

export default {
  motivation: { title: '동기' },
  installation: { title: '설치하기' },
  '--- API Reference': {
    type: 'separator',
    title: 'API 문서',
  },
  SuspenseQuery: { title: '<SuspenseQuery/>' },
  SuspenseQueries: { title: '<SuspenseQueries/>' },
  SuspenseInfiniteQuery: { title: '<SuspenseInfiniteQuery/>' },
  Mutation: { title: '<Mutation/>' },
  PrefetchQuery: { title: '<PrefetchQuery/>' },
  PrefetchInfiniteQuery: { title: '<PrefetchInfiniteQuery/>' },
  QueriesHydration: { title: '<QueriesHydration/>' },
  QueryClientConsumer: { title: '<QueryClientConsumer/>' },
  IsFetching: { title: '<IsFetching/>' },
  createGetQueryClient: { title: 'createGetQueryClient' },
  mutationOptions: { title: 'mutationOptions' },
  usePrefetchQuery: { title: 'usePrefetchQuery' },
  usePrefetchInfiniteQuery: { title: 'usePrefetchInfiniteQuery' },
  '--- Deprecated': {
    type: 'separator',
    title: 'Deprecated',
  },
  queryOptions: { title: 'queryOptions' },
  infiniteQueryOptions: { title: 'infiniteQueryOptions' },
  useSuspenseQuery: { title: 'useSuspenseQuery' },
  useSuspenseQueries: { title: 'useSuspenseQueries' },
  useSuspenseInfiniteQuery: { title: 'useSuspenseInfiniteQuery' },
  '--- More': {
    type: 'separator',
    title: '더보기',
  },
  migration: { title: '마이그레이션 가이드' },
} satisfies typeof MetaEn satisfies MetaRecord
