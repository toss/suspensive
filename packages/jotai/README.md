# @suspensive/jotai

@suspensive/jotai builds on the Jotai state management library, adding features that work seamlessly with React Suspense. It provides utilities for managing state using atoms, which can be easily integrated into Suspense-based workflows.

[![npm version](https://img.shields.io/npm/v/@suspensive/jotai?color=000&labelColor=000&logo=npm&label=)](https://www.npmjs.com/package/@suspensive/jotai) [![npm](https://img.shields.io/npm/dm/@suspensive/jotai?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/jotai) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/@suspensive/jotai?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/jotai)

## Installation

@suspensive/jotai is available on npm. To install the latest stable version, run the following command:

```shell npm2yarn
npm install @suspensive/jotai jotai
```

## Features

- ⚛️ **Jotai Integration**: Enhanced atom-based state management with Suspense support
- 🚀 **Suspense Ready**: Built-in support for React Suspense patterns
- 🎯 **Type-safe**: Full TypeScript support with excellent type inference
- 🔄 **Async Atoms**: Seamless async state management
- ⚡ **Performance**: Optimized for minimal re-renders
- 🧪 **Well-tested**: Comprehensive test coverage

## Quick Start

```jsx
import { Suspense } from 'react'
import { atom, useAtom } from 'jotai'
import { atomWithSuspenseQuery } from '@suspensive/jotai'

// Create an async atom with suspense
const userAtom = atomWithSuspenseQuery(() => ({
  queryKey: ['user'],
  queryFn: async () => {
    const response = await fetch('/api/user')
    return response.json()
  },
}))

function UserProfile() {
  const [user] = useAtom(userAtom)
  return <div>Hello, {user.name}!</div>
}

function App() {
  return (
    <Suspense fallback={<div>Loading user...</div>}>
      <UserProfile />
    </Suspense>
  )
}
```

## Core Features

### atomWithSuspenseQuery

Create atoms that integrate with TanStack Query and support Suspense.

### Async State Management

Handle asynchronous state with automatic Suspense integration.

### Type Safety

Full TypeScript support for all atom operations and state management.

## Documentation

For comprehensive guides, API references, and examples, visit [suspensive.org](https://suspensive.org).

## License

MIT © [Viva Republica, Inc.](https://github.com/toss/suspensive/blob/main/LICENSE)
