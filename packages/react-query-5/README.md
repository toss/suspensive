# @suspensive/react-query-5

@suspensive/react-query-5 provides Suspensive interfaces specifically for @tanstack/react-query version 5, offering the latest features and enhanced Suspense integration for your data fetching needs.

[![npm version](https://img.shields.io/npm/v/@suspensive/react-query-5?color=000&labelColor=000&logo=npm&label=)](https://www.npmjs.com/package/@suspensive/react-query-5)
[![npm](https://img.shields.io/npm/dm/@suspensive/react-query-5?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/react-query-5)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@suspensive/react-query-5?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/react-query-5)

## Installation

@suspensive/react-query-5 is available on npm. To install the latest stable version, run the following command:

```shell npm2yarn
npm install @suspensive/react-query-5 @tanstack/react-query@5
```

## Features

- 🚀 **TanStack Query v5 Support**: Built for the latest @tanstack/react-query version 5
- ⚡ **Modern Features**: Leverages the newest capabilities of TanStack Query v5
- 🎯 **Type-safe**: Full TypeScript support with excellent type inference
- 🔄 **Enhanced Suspense**: Better integration with React Suspense for data fetching
- 🏗️ **ES Private Fields**: Uses modern JavaScript features for better performance

## Usage

```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSuspenseQuery } from '@suspensive/react-query-5'
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

## Browser Compatibility

Note that @tanstack/react-query v5 uses ES private fields, which may not be supported in older browsers. If you need to support legacy browsers, consider using [@suspensive/react-query-4](../react-query-4) instead.

## Community Resource

This library is currently [a community resource for TanStack Query](https://tanstack.com/query/latest/docs/framework/react/community/suspensive-react-query), providing official support and documentation.

## Documentation

For comprehensive guides, API references, and examples, visit [suspensive.org](https://suspensive.org).

## License

MIT © [Viva Republica, Inc.](https://github.com/toss/suspensive/blob/main/LICENSE)
