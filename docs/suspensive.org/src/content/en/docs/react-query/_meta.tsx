import type { MetaRecord } from 'nextra'

export default {
  motivation: { title: 'Why need to use?' },
  installation: { title: 'Installation' },
  'tanstack-query-compatibility': {
    title: 'Support both TanStack Query v4 and 5',
  },
  migration: { title: 'Migration guide' },
  '--- API Reference': {
    type: 'separator',
    title: 'API Reference',
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
} satisfies MetaRecord
