<div align="center">
  <a href="https://suspensive.org" title="Suspensive Libraries - TypeScript/JavaScript packages to use React Suspense easily">
    <img src="https://github.com/toss/suspensive/blob/main/assets/logo_background_star.png?raw=true" alt="Suspensive Libraries Logo - TypeScript/JavaScript packages to use React Suspense easily." width="600" />
    <h1 align="center">Suspensive</h1>
  </a>
</div>

<div align="center">

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge&color=000&labelColor=000)](https://github.com/toss/suspensive/blob/main/LICENSE)
[![@suspensive/react downloads](https://img.shields.io/npm/dt/@suspensive/react.svg?label=@suspensive/react&color=000&labelColor=000&style=for-the-badge)](https://www.npmjs.com/package/@suspensive/react)
[![@suspensive/react-query downloads](https://img.shields.io/npm/dt/@suspensive/react-query.svg?label=@suspensive/react-query&color=000&labelColor=000&style=for-the-badge)](https://www.npmjs.com/package/@suspensive/react-query)

[![codecov](https://codecov.io/gh/toss/suspensive/graph/badge.svg?token=5PopssACmx)](https://codecov.io/gh/toss/suspensive) [![CodSpeed Badge](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/toss/suspensive) ![GitHub stars](https://img.shields.io/github/stars/toss/suspensive?style=social) ![GitHub forks](https://img.shields.io/github/forks/toss/suspensive?style=social)

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

- Suspense
- ErrorBoundary, ErrorBoundary.Consumer useErrorBoundary, useErrorBoundaryFallbackProps
- ErrorBoundaryGroup, ErrorBoundaryGroup.Consumer useErrorBoundaryGroup
- Delay
- Suspensive, SuspensiveProvider
- DevMode
- wrap

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
    <ErrorBoundaryGroup.Consumer>
      {(group) => <button onClick={group.reset}>Reset All</button>}
    </ErrorBoundaryGroup.Consumer>
    <ErrorBoundary fallback={(props) => <button onClick={props.reset}>Reset error: {props.error.message}</button>}>
      <Suspense
        fallback={
          <Delay ms={200}>
            <Spinner />
          </Delay>
        }
      >
        <SuspenseMaker />
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

- useSuspenseQuery, useSuspenseQueries, useSuspenseInfiniteQuery
- SuspenseQuery, SuspenseInfiniteQuery
- QueryErrorBoundary
- queryOptions

### Installation

```shell
npm install @suspensive/react-query @tanstack/react-query@4
```

```shell
pnpm add @suspensive/react-query @tanstack/react-query@4
```

```shell
yarn add @suspensive/react-query @tanstack/react-query@4
```

### Usage

```tsx
import { Suspense } from '@suspensive/react'
import { QueryErrorBoundary, useSuspenseQuery, SuspenseQuery, queryOptions } from '@suspensive/react-query'

const customQuery = () =>
  queryOptions({
    queryKey: ['queryKey'],
    queryFn: () => Promise.resolve({ text: 'Hello Suspensive' }),
  })

const SuspenseMaker = () => {
  const query = useSuspenseQuery(customQuery())
  return <>{query.data}</>
}

const Example = () => (
  <QueryErrorBoundary fallback={(props) => <button onClick={props.reset}>Reset error: {props.error.message}</button>}>
    <Suspense fallback={<Spinner />}>
      <SuspenseMaker />
    </Suspense>
    <Suspense fallback={<Spinner />}>
      <SuspenseQuery {...customQuery()} select={({ text }) => text}>
        {({ data: text }) => <>{text}</>}
      </SuspenseQuery>
    </Suspense>
  </QueryErrorBoundary>
)
```

<br/>

## Docs [![deployment](https://img.shields.io/github/deployments/toss/suspensive/Production%20%E2%80%93%20suspensive.org?label=vercel&logo=vercel&logoColor=white&color=000&labelColor=000)](https://suspensive.org)

We provide Official Docs

See [OFFICIAL DOCS](https://suspensive.org)

<br/>

## Visualization [![deployment](https://img.shields.io/github/deployments/toss/suspensive/Production%20%E2%80%93%20visualization.suspensive.org?label=vercel&logo=vercel&logoColor=white&color=000&labelColor=000)](https://visualization.suspensive.org)

Concepts Visualization ready. You can see core concepts of Suspensive visually

See [VISUALIZATION](https://visualization.suspensive.org).

<br/>

## Contributing

Read our [Contributing Guide](./CONTRIBUTING.md) to familiarize yourself with Suspensive's development process, how to suggest bug fixes and improvements, and the steps for building and testing your changes.

### Contributors

[![contributors](https://contrib.rocks/image?repo=toss/suspensive)](https://github.com/toss/suspensive/graphs/contributors)

<br/>

## License

MIT © Viva Republica, Inc. See [LICENSE](./LICENSE) for details.

<a title="Toss" href="https://toss.im">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://static.toss.im/logos/png/4x/logo-toss-reverse.png">
    <img alt="Toss" src="https://static.toss.im/logos/png/4x/logo-toss.png" width="100">
  </picture>
</a>
