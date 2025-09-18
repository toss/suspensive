# @suspensive/react-query-4

@suspensive/react-query-4 provides Suspensive interfaces specifically for @tanstack/react-query version 4, offering enhanced Suspense integration for your data fetching needs.

[![npm version](https://img.shields.io/npm/v/@suspensive/react-query-4?color=000&labelColor=000&logo=npm&label=)](https://www.npmjs.com/package/@suspensive/react-query-4)
[![npm](https://img.shields.io/npm/dm/@suspensive/react-query-4?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/react-query-4)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@suspensive/react-query-4?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/react-query-4)

## Installation

@suspensive/react-query-4 is available on npm. To install the latest stable version, run the following command:

```shell npm2yarn
npm install @suspensive/react-query-4 @tanstack/react-query@4
```

## Features

- 🔄 **TanStack Query v4 Support**: Specifically designed for @tanstack/react-query version 4
- 🚀 **Enhanced Suspense**: Better integration with React Suspense for data fetching
- 🎯 **Type-safe**: Full TypeScript support with excellent type inference
- 🌐 **Browser Compatibility**: Supports [lower version browsers](https://suspensive.org/docs/react-query/motivation#solution-for-the-issue-of-tanstackreact-query-v5-not-being-able-to-support-lower-version-browsers-due-to-es-private-field) compared to v5
- ⚡ **Performance**: Optimized for production use

## Usage

```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSuspenseQuery } from '@suspensive/react-query-4'
import { Suspense } from 'react'

const queryClient = new QueryClient()

function UserProfile({ userId }) {
  const { data: user } = useSuspenseQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  })

  return <div>Hello, {user.name}!</div>
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        <UserProfile userId={1} />
      </Suspense>
    </QueryClientProvider>
  )
}
```

## Community Resource

This library is currently [a community resource for TanStack Query](https://tanstack.com/query/v4/docs/framework/react/community/suspensive-react-query), providing official support and documentation.

## Documentation

For comprehensive guides, API references, and examples, visit [suspensive.org](https://suspensive.org).

## License

MIT © [Viva Republica, Inc.](https://github.com/toss/suspensive/blob/main/LICENSE)
