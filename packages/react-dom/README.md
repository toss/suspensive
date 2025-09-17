# @suspensive/react-dom

@suspensive/react-dom provides Suspensive interfaces specifically designed for react-dom, enhancing your React applications with better Suspense integration for DOM-specific features.

[![npm version](https://img.shields.io/npm/v/@suspensive/react-dom?color=000&labelColor=000&logo=npm&label=)](https://www.npmjs.com/package/@suspensive/react-dom)
[![npm](https://img.shields.io/npm/dm/@suspensive/react-dom?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/react-dom)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@suspensive/react-dom?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/react-dom)

## Installation

@suspensive/react-dom is available on npm. To install the latest stable version, run the following command:

```shell npm2yarn
npm install @suspensive/react-dom react-dom
```

## Features

- 🚀 **DOM-specific Suspense utilities**: Enhanced components and hooks tailored for react-dom
- 🎯 **Type-safe**: Full TypeScript support with excellent type inference
- ⚡ **Lightweight**: Minimal bundle size impact
- 🔄 **React 18+ Support**: Built for modern React with Suspense

## Usage

```jsx
import { Suspense } from '@suspensive/react-dom'

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <YourAsyncComponent />
    </Suspense>
  )
}
```

## Documentation

For comprehensive guides, API references, and examples, visit [suspensive.org](https://suspensive.org).

## License

MIT © [Viva Republica, Inc.](https://github.com/toss/suspensive/blob/main/LICENSE)