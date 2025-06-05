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
  queryOptions: { title: 'queryOptions' },
  infiniteQueryOptions: { title: 'infiniteQueryOptions' },
  mutationOptions: { title: 'mutationOptions' },
  useSuspenseQuery: { title: 'useSuspenseQuery' },
  useSuspenseQueries: { title: 'useSuspenseQueries' },
  useSuspenseInfiniteQuery: { title: 'useSuspenseInfiniteQuery' },
  usePrefetchQuery: { title: 'usePrefetchQuery' },
  usePrefetchInfiniteQuery: { title: 'usePrefetchInfiniteQuery' },
  SuspenseQuery: { title: '<SuspenseQuery />' },
  SuspenseQueries: { title: '<SuspenseQueries />' },
  SuspenseInfiniteQuery: { title: '<SuspenseInfiniteQuery />' },
  Mutation: { title: '<Mutation />' },
  PrefetchQuery: { title: '<PrefetchQuery />' },
  PrefetchInfiniteQuery: { title: '<PrefetchInfiniteQuery />' },
  QueryClientConsumer: { title: '<QueryClientConsumer />' },
} satisfies typeof MetaEn satisfies MetaRecord
