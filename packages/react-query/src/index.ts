import TanStackReactQuery from '@tanstack/react-query/package.json'
import { isVersion } from './utils'

if (process.env.NODE_ENV === 'development') {
  if (!isVersion(4).of(TanStackReactQuery.version)) {
    console.warn(
      `@suspensive/react-query: We support only @tanstack/react-query v4. but you installed @tanstack/react-query@${TanStackReactQuery.version}. Please install @tanstack/react-query v4 correctly`
    )
  }
}

export { queryOptions } from './queryOptions'
export { SuspenseQuery } from './SuspenseQuery'
export { SuspenseInfiniteQuery } from './SuspenseInfiniteQuery'

export { useSuspenseQuery } from './useSuspenseQuery'
export type { UseSuspenseQueryOptions, UseSuspenseQueryResult } from './useSuspenseQuery'
export { useSuspenseQueries } from './useSuspenseQueries'
export type { SuspenseQueriesOptions, SuspenseQueriesResults } from './useSuspenseQueries'
export { useSuspenseInfiniteQuery } from './useSuspenseInfiniteQuery'
export type { UseSuspenseInfiniteQueryOptions, UseSuspenseInfiniteQueryResult } from './useSuspenseInfiniteQuery'

export { QueryErrorBoundary } from './QueryErrorBoundary'
