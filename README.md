<div align="center">
  <a href="https://suspensive.org" title="Suspensive Libraries - TypeScript/JavaScript packages to use React Suspense easily">
    <img src="https://github.com/toss/suspensive/blob/main/assets/logo_background_star.png?raw=true" alt="Suspensive Libraries Logo - TypeScript/JavaScript packages to use React Suspense easily." width="600" />
    <h1 align="center">Suspensive</h1>
  </a>
  <p style="font-size:18px;">Manage asynchronous operations, timing, error handling, detecting intersection of elements, and caching easily</p>
</div>

<div align="center">

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?color=green&labelColor=#5D5D5D)](https://github.com/toss/suspensive/blob/main/LICENSE) [![codecov](https://codecov.io/gh/toss/suspensive/graph/badge.svg?token=5PopssACmx)](https://codecov.io/gh/toss/suspensive) [![CodSpeed Badge](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/toss/suspensive) ![GitHub stars](https://img.shields.io/github/stars/toss/suspensive?style=social)

</div>

<br/>

## Available Packages

### [@suspensive/react](https://suspensive.org/docs/react/motivation) [![npm version](https://img.shields.io/npm/v/@suspensive/react?color=000&labelColor=000&logo=npm&label=)](https://www.npmjs.com/package/@suspensive/react) [![npm](https://img.shields.io/npm/dm/@suspensive/react?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/react) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/@suspensive/react?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/react)

> This package offers components that leverage React Suspense to handle asynchronous operations gracefully. It includes components like Suspense, ErrorBoundary, and ErrorBoundaryGroup, along with utilities like Delay for managing timing in your React applications.

Key features: Suspense, ErrorBoundary, ErrorBoundaryGroup, Delay, and more.

### [@suspensive/react-query](https://suspensive.org/docs/react-query/motivation) [![npm version](https://img.shields.io/npm/v/@suspensive/react-query?color=000&labelColor=000&logo=npm&label=)](https://www.npmjs.com/package/@suspensive/react-query) [![npm](https://img.shields.io/npm/dm/@suspensive/react-query?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/react-query) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/@suspensive/react-query?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/react-query)

> This package enhances React Query with Suspense support, allowing for simpler and more declarative data fetching. It provides hooks like useSuspenseQuery and useSuspenseInfiniteQuery, which integrate seamlessly with React Suspense. Additionally, it includes QueryErrorBoundary for handling errors during data fetching.

Key features: useSuspenseQuery, useSuspenseQueries, useSuspenseInfiniteQuery, queryOptions, QueryErrorBoundary, Mutation, and more.

### [@suspensive/jotai](https://suspensive.org/docs/jotai/motivation) [![npm version](https://img.shields.io/npm/v/@suspensive/jotai?color=000&labelColor=000&logo=npm&label=)](https://www.npmjs.com/package/@suspensive/jotai) [![npm](https://img.shields.io/npm/dm/@suspensive/jotai?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/jotai) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/@suspensive/jotai?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/jotai)

> This package builds on the Jotai state management library, adding features that work well with React Suspense. It provides utilities for managing state using atoms, which can be easily integrated into Suspense-based workflows.

Key features: Atom, AtomValue, SetAtom, and more.

### @suspensive/cache [![npm version](https://img.shields.io/npm/v/@suspensive/cache?color=000&labelColor=000&logo=npm&label=)](https://www.npmjs.com/package/@suspensive/cache) [![npm](https://img.shields.io/npm/dm/@suspensive/cache?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/cache) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/@suspensive/cache?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/cache)

> This package provides caching solutions that can be used within React applications. It includes hooks like useCache and useCacheStore, as well as providers for managing and storing cache data efficiently.

Key features: Cache, useCache, CacheStore, useCacheStore, CacheStoreProvider, and more.

### @suspensive/intersection [![MIT License](https://img.shields.io/badge/work_in_progress-npm.svg?color=000&labelColor=000&logo=npm)](https://github.com/toss/suspensive/blob/main/LICENSE)

> This package is designed to simplify the detection and management of elements within the viewport using the Intersection Observer API. It will provide React hooks and components to help developers efficiently track element visibility and perform actions when elements enter or leave the viewport. This can be particularly useful for lazy loading images, implementing infinite scroll, and triggering animations as elements come into view.

Status: Work In Progress.

<br/>

## Visit [suspensive.org](https://suspensive.org) for docs, guides, API and more!

[English](https://suspensive.org/en) | [한국어](https://suspensive.org/ko)

<br/>

## Contributing

Read our [Contributing Guide](./CONTRIBUTING.md) to familiarize yourself with Suspensive's development process, how to suggest bug fixes and improvements, and the steps for building and testing your changes.

### Contributors

[![contributors](https://contrib.rocks/image?repo=toss/suspensive)](https://github.com/toss/suspensive/graphs/contributors)

<br/>

<a title="Toss" href="https://toss.im">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://static.toss.im/logos/png/4x/logo-toss-reverse.png">
    <img alt="Toss" src="https://static.toss.im/logos/png/4x/logo-toss.png" width="100">
  </picture>
</a>

MIT © Viva Republica, Inc. See [LICENSE](./LICENSE) for details.
