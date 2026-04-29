import type { MetaRecord } from 'nextra'

export default {
  motivation: { title: 'Motivation' },
  installation: { title: 'Installation' },
  migration: { title: 'Migration guide' },
  '--- API Reference': {
    type: 'separator',
    title: 'API Reference',
  },
  createGetQueryClient: { title: 'createGetQueryClient' },
  SuspenseQuery: { title: '<SuspenseQuery/>' },
  SuspenseQueries: { title: '<SuspenseQueries/>' },
  SuspenseInfiniteQuery: { title: '<SuspenseInfiniteQuery/>' },
  Mutation: { title: '<Mutation/>' },
  PrefetchQuery: { title: '<PrefetchQuery/>' },
  PrefetchInfiniteQuery: { title: '<PrefetchInfiniteQuery/>' },
  QueriesHydration: { title: '<QueriesHydration/>' },
  QueryClientConsumer: { title: '<QueryClientConsumer/>' },
  IsFetching: { title: '<IsFetching/>' },
} satisfies MetaRecord
