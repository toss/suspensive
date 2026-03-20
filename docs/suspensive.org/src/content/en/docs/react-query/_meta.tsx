import type { MetaRecord } from 'nextra'

export default {
  motivation: { title: 'Motivation' },
  installation: { title: 'Installation' },
  'tanstack-query-compatibility': {
    title: 'TanStack Query v4 & v5 Support',
  },
  migration: { title: 'Migration Guide' },
  '--- API Reference': {
    type: 'separator',
    title: 'API Reference',
  },
  createGetQueryClient: { title: 'createGetQueryClient' },
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
  '--- Deprecated': {
    type: 'separator',
    title: 'Deprecated',
  },
  queryOptions: { title: 'queryOptions' },
  infiniteQueryOptions: { title: 'infiniteQueryOptions' },
  useSuspenseQuery: { title: 'useSuspenseQuery' },
  useSuspenseQueries: { title: 'useSuspenseQueries' },
  useSuspenseInfiniteQuery: { title: 'useSuspenseInfiniteQuery' },
} satisfies MetaRecord
