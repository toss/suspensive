# @suspensive/react

@suspensive/react provides all the essential components and hooks to use React Suspense easily and effectively in your applications.

[![npm version](https://img.shields.io/npm/v/@suspensive/react?color=000&labelColor=000&logo=npm&label=)](https://www.npmjs.com/package/@suspensive/react)
[![npm](https://img.shields.io/npm/dm/@suspensive/react?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/react)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@suspensive/react?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/react)

## Installation

@suspensive/react is available on npm. To install the latest stable version, run the following command:

```shell
npm install @suspensive/react
```

## Features

- 🚀 **Easy Suspense**: Declarative loading states with React Suspense
- 🛡️ **Error Boundaries**: Built-in error handling components
- 🎯 **Type-safe**: Full TypeScript support with excellent type inference
- 🔄 **Async/Await**: Better async/await support with Suspense
- ⚡ **Performance**: Optimized for production use
- 🧪 **Well-tested**: Comprehensive test coverage

## Quick Start

```jsx
import { Suspense, ErrorBoundary, Async } from '@suspensive/react'

function App() {
  return (
    <ErrorBoundary
      fallback={({ error, reset }) => (
        <div>
          <h2>Something went wrong:</h2>
          <details>{error.message}</details>
          <button onClick={reset}>Try again</button>
        </div>
      )}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <AsyncComponent />
      </Suspense>
    </ErrorBoundary>
  )
}

// Use Async for async/await patterns
function AsyncComponent() {
  return (
    <Async>
      {async () => {
        const data = await fetchData()
        return <div>{data.message}</div>
      }}
    </Async>
  )
}
```

## Core Components

### Suspense

Enhanced Suspense component with better developer experience.

### ErrorBoundary

Declarative error boundaries for React components.

### Async

Component for handling async operations with Suspense.

### Delay

Add delays to prevent flash of loading states.

## Documentation

For comprehensive guides, API references, and examples, visit [suspensive.org](https://suspensive.org).

## License

MIT © [Viva Republica, Inc.](https://github.com/toss/suspensive/blob/main/LICENSE)
