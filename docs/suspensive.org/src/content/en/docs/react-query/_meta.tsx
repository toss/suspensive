import type { MetaRecord } from 'nextra'

export default {
  motivation: { title: 'Why need to use?' },
  installation: { title: 'Installation' },
  'tanstack-query-compatibility': {
    title: 'Support both TanStack Query v4 and 5',
  },
  'migrate-to-v2': { title: 'Migrating to v2' },
  '--- API Reference': {
    type: 'separator',
    title: 'API Reference',
  },
  queryOptions: { title: 'queryOptions' },
  infiniteQueryOptions: { title: 'infiniteQueryOptions' },
  useSuspenseQuery: { title: 'useSuspenseQuery' },
  useSuspenseQueries: { title: 'useSuspenseQueries' },
  useSuspenseInfiniteQuery: { title: 'useSuspenseInfiniteQuery' },
  usePrefetchQuery: { title: 'usePrefetchQuery' },
  usePrefetchInfiniteQuery: { title: 'usePrefetchInfiniteQuery' },
  SuspenseQuery: { title: '<SuspenseQuery/>' },
  SuspenseQueries: { title: '<SuspenseQueries/>' },
  SuspenseInfiniteQuery: { title: '<SuspenseInfiniteQuery/>' },
  Mutation: { title: '<Mutation/>' },
  PrefetchQuery: { title: '<PrefetchQuery/>' },
  PrefetchInfiniteQuery: { title: '<PrefetchInfiniteQuery/>' },
  QueryClientConsumer: { title: '<QueryClientConsumer/>' },
} satisfies MetaRecord
