<div align="center">
  <a href="https://suspensive.org" title="Suspensive Libraries - TypeScript/JavaScript packages to use React Suspense easily">
    <img src="https://github.com/suspensive/react/blob/main/assets/logo_background_star.png?raw=true" alt="Suspensive Libraries Logo - TypeScript/JavaScript packages to use React Suspense easily." height="180" />
    <h1 align="center">Suspensive</h1>
  </a>
</div>

<div align="center">

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge&color=000&labelColor=000)](https://github.com/suspensive/react/blob/main/LICENSE)
[![@suspensive/react downloads](https://img.shields.io/npm/dt/@suspensive/react.svg?label=@suspensive/react&color=000&labelColor=000&style=for-the-badge)](https://www.npmjs.com/package/@suspensive/react)
[![@suspensive/react-query downloads](https://img.shields.io/npm/dt/@suspensive/react-query.svg?label=@suspensive/react-query&color=000&labelColor=000&style=for-the-badge)](https://www.npmjs.com/package/@suspensive/react-query)

[![codecov](https://codecov.io/gh/suspensive/react/branch/main/graph/badge.svg?token=H4VQ71NJ16)](https://codecov.io/gh/suspensive/react) ![GitHub stars](https://img.shields.io/github/stars/suspensive/react?style=social) ![GitHub forks](https://img.shields.io/github/forks/suspensive/react?style=social)

[OFFICIAL DOCS](https://suspensive.org) | [VISUALIZATION](https://visualization.suspensive.org) | [DEPENDENCY GRAPH](https://graph.suspensive.org)

</div>

<br/>
<br/>

## [@suspensive/react](https://suspensive.org/docs/react/installation)

[![npm version](https://img.shields.io/npm/v/@suspensive/react?color=000&labelColor=000&logo=npm&label=)](https://www.npmjs.com/package/@suspensive/react)
[![npm](https://img.shields.io/npm/dm/@suspensive/react?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/react)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@suspensive/react?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/react)

All declarative components to use suspense on both CSR, SSR.

### Features

- Suspense, withSuspense (containing CSROnly)
- ErrorBoundary, withErrorBoundary, useErrorBoundary, useErrorBoundaryFallbackProps
- ErrorBoundaryGroup, withErrorBoundaryGroup, useErrorBoundaryGroup
- Delay, withDelay
- SuspensiveProvider, Suspensive

### Installation

```shell
npm install @suspensive/react
```

```shell
pnpm add @suspensive/react
```

```shell
yarn add @suspensive/react
```

### Usage

```tsx
import { Suspense, ErrorBoundary, ErrorBoundaryGroup, Delay } from '@suspensive/react'

const Example = () => (
  <ErrorBoundaryGroup>
    <ErrorBoundaryGroup.Reset trigger={(group) => <button onClick={group.reset}>Reset All</button>} />
    <ErrorBoundary
      fallback={(props) => (
        <>
          <button onClick={props.reset}>Try again</button>
          {props.error.message}
        </>
      )}
    >
      <Suspense
        fallback={
          <Delay>
            <Spinner />
          </Delay>
        }
      >
        <SuspendedComponent />
      </Suspense>
    </ErrorBoundary>
  </ErrorBoundaryGroup>
)
```

<br/>
<br/>

## [@suspensive/react-query](https://suspensive.org/docs/react-query/installation)

[![npm version](https://img.shields.io/npm/v/@suspensive/react-query?color=000&labelColor=000&logo=npm&label=)](https://www.npmjs.com/package/@suspensive/react-query)
[![npm](https://img.shields.io/npm/dm/@suspensive/react-query?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/react-query)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@suspensive/react-query?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/react-query)

Declarative apis to use [@tanstack/react-query with suspense](https://tanstack.com/query/v4/docs/guides/suspense) easily.

### Features

- useSuspenseQuery
- useSuspenseQueries
- useSuspenseInfiniteQuery
- QueryErrorBoundary

### Installation

```shell
npm install @suspensive/react-query
```

```shell
pnpm add @suspensive/react-query
```

```shell
yarn add @suspensive/react-query
```

### Usage

```tsx
import { Suspense } from '@suspensive/react'
import { QueryErrorBoundary, useSuspenseQuery } from '@suspensive/react-query'

const Example = () => (
  <QueryErrorBoundary
    fallback={(props) => (
      <>
        <button onClick={props.reset}>Try again</button>
        {props.error.message}
      </>
    )}
  >
    <Suspense fallback={<Spinner />}>
      <SuspendedComponent />
    </Suspense>
  </QueryErrorBoundary>
)

const SuspendedComponent = () => {
  const query = useSuspenseQuery({
    queryKey,
    queryFn,
  })

  return <>{query.data}</>
}
```

<br/>

## Docs [![deployment](https://img.shields.io/github/deployments/suspensive/react/Production%20%E2%80%93%20docs?label=vercel&logo=vercel&logoColor=white&color=000&labelColor=000)](https://suspensive.org)

We provide Official Docs

See [OFFICIAL DOCS](https://suspensive.org)

<br/>

## Visualization [![deployment](https://img.shields.io/github/deployments/suspensive/react/Production%20%E2%80%93%20Visualization?label=vercel&logo=vercel&logoColor=white&color=000&labelColor=000)](https://visualization.suspensive.org)

Concepts Visualization ready. You can see core concepts of Suspensive visually

See [VISUALIZATION](https://visualization.suspensive.org).

<br/>

## Contributing

Read our [Contributing Guide](./CONTRIBUTING.md) to familiarize yourself with Suspensive's development process, how to suggest bug fixes and improvements, and the steps for building and testing your changes.

### Contributors

[![contributors](https://contrib.rocks/image?repo=suspensive/react)](https://github.com/suspensive/react/graphs/contributors)

<br/>

## License

MIT © Suspensive. See [LICENSE](./LICENSE) for details.

<div align="center">
  <a title="Suspensive" href="https://github.com/suspensive">
    <div style='display:flex; align-items:center;'>
      <img alt="Suspensive" src="https://github.com/suspensive/react/blob/main/docs/public/img/logo_dark.png?raw=true" width="24">
      <sup>Suspensive</sup>
    </div>
  </a>
</div>
