import type { MetaRecord } from 'nextra'

export default {
  motivation: { title: 'Motivation' },
  installation: { title: 'Installation' },
  '--- API Reference': {
    type: 'separator',
    title: 'API Reference',
  },
  SuspenseQuery: { title: '<SuspenseQuery/>' },
  SuspenseQueries: { title: '<SuspenseQueries/>' },
  SuspenseInfiniteQuery: { title: '<SuspenseInfiniteQuery/>' },
  Mutation: { title: '<Mutation/>' },
  PrefetchQuery: { title: '<PrefetchQuery/>' },
  PrefetchInfiniteQuery: { title: '<PrefetchInfiniteQuery/>' },
  Hydrate: { title: '<Hydrate/>' },
  HydrationBoundary: { title: '<HydrationBoundary/>' },
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
    title: 'More',
  },
  migration: { title: 'Migration Guide' },
} satisfies MetaRecord
