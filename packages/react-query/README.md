# @suspensive/react-query

@suspensive/react-query provides components and hooks to use @tanstack/react-query's suspense features easily and effectively, supporting both v4 and v5 with automatic version detection.

[![npm version](https://img.shields.io/npm/v/@suspensive/react-query?color=000&labelColor=000&logo=npm&label=)](https://www.npmjs.com/package/@suspensive/react-query)
[![npm](https://img.shields.io/npm/dm/@suspensive/react-query?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/react-query)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@suspensive/react-query?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/react-query)

## Installation

@suspensive/react-query is available on npm.

From version 2.2.0 onwards, it supports both v4 and v5 of @tanstack/react-query. Depending on the version of @tanstack/react-query specified in your package.json dependencies, the appropriate version of @suspensive/react-query will be used automatically.

To use the latest stable version, run the following command:

```shell npm2yarn
npm install @suspensive/react-query @tanstack/react-query
```

To use @tanstack/react-query v4, run the following command.
@tanstack/react-query v4 supports [lower version browsers](https://suspensive.org/docs/react-query/motivation#solution-for-the-issue-of-tanstackreact-query-v5-not-being-able-to-support-lower-version-browsers-due-to-es-private-field) compared to v5.

```shell npm2yarn
npm install @suspensive/react-query @tanstack/react-query@4
```

## Features

- 🔄 **Dual Version Support**: Automatically works with both TanStack Query v4 and v5
- 🚀 **Suspense Integration**: Enhanced React Suspense support for data fetching
- 🎯 **Type-safe**: Full TypeScript support with excellent type inference
- 🛡️ **Error Handling**: Built-in error boundary integration
- ⚡ **Performance**: Optimized for production use
- 🌐 **Browser Support**: v4 compatible with older browsers

## Quick Start

```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSuspenseQuery, useSuspenseInfiniteQuery } from '@suspensive/react-query'
import { Suspense, ErrorBoundary } from '@suspensive/react'

const queryClient = new QueryClient()

function UserProfile({ userId }) {
  const { data: user } = useSuspenseQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  })
  
  return <div>Hello, {user.name}!</div>
}

function UserPosts({ userId }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery({
    queryKey: ['posts', userId],
    queryFn: ({ pageParam = 0 }) => fetchUserPosts(userId, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

  return (
    <div>
      {data.pages.map((page) =>
        page.posts.map((post) => <div key={post.id}>{post.title}</div>)
      )}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          Load More
        </button>
      )}
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary fallback={({ error, reset }) => (
        <div>
          <h2>Something went wrong:</h2>
          <details>{error.message}</details>
          <button onClick={reset}>Try again</button>
        </div>
      )}>
        <Suspense fallback={<div>Loading...</div>}>
          <UserProfile userId={1} />
          <UserPosts userId={1} />
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  )
}
```

## Core Hooks

### useSuspenseQuery
Enhanced `useQuery` with built-in Suspense support.

### useSuspenseQueries
Suspense version of `useQueries` for parallel queries.

### useSuspenseInfiniteQuery
Enhanced `useInfiniteQuery` with built-in Suspense support.

### Query Options
- `queryOptions` - Type-safe query option builder
- `infiniteQueryOptions` - Type-safe infinite query option builder
- `mutationOptions` - Type-safe mutation option builder

## Community Resource

This library is currently [a community resource for TanStack Query](https://tanstack.com/query/latest/docs/framework/react/community/suspensive-react-query), providing official support and documentation.

## Documentation

For comprehensive guides, API references, and examples, visit [suspensive.org](https://suspensive.org).

## License

MIT © [Viva Republica, Inc.](https://github.com/toss/suspensive/blob/main/LICENSE)
