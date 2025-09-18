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
import { Atom } from '@suspensive/jotai'
import { Suspense } from '@suspensive/react'
import { atom } from 'jotai'

// Create an async atom
const userAtom = atom(async () => {
  const response = await fetch('/api/user')
  return response.json()
})

function App() {
  return (
    <Suspense fallback={<div>Loading user...</div>}>
      <Atom atom={userAtom}>{([user]) => <div>Hello, {user.name}!</div>}</Atom>
    </Suspense>
  )
}
```

## Core Components

### Atom

Declarative interface for using Jotai atoms with automatic Suspense support for async atoms.

### AtomValue

Read-only interface for atom values, similar to Jotai's useAtomValue but as a component.

### SetAtom

Write-only interface for updating atoms, providing a declarative way to access atom setters.

### Type Safety

Full TypeScript support for all atom operations and state management.

## Documentation

For comprehensive guides, API references, and examples, visit [suspensive.org](https://suspensive.org).

## License

MIT © [Viva Republica, Inc.](https://github.com/toss/suspensive/blob/main/LICENSE)
