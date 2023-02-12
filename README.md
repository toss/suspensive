<div align="center">
  <a href="https://docs.suspensive.org" title="Suspensive Libraries - TypeScript/JavaScript packages to use React Suspense easily">
    <img src="https://raw.githubusercontent.com/suspensive/react/main/websites/docs/static/banner.png" alt="Suspensive Libraries Logo - TypeScript/JavaScript packages to use React Suspense easily." />
  </a>
</div>


<br/>

<div align="center">

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge&color=61DAFB)](https://github.com/suspensive/react/blob/main/LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-deepgreen.svg?style=for-the-badge&color=blue)](https://github.com/suspensive/react/pulls) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-deepgreen.svg?style=for-the-badge&color=blue)](http://commitizen.github.io/cz-cli/)

![GitHub stars](https://img.shields.io/github/stars/suspensive/react?style=social) ![GitHub stars](https://img.shields.io/github/forks/suspensive/react?style=social)

</div>

<div align="center">

[OFFICIAL DOCS](https://docs.suspensive.org) | [VISUALIZATION](https://visualization.suspensive.org) | [CONTRIBUTING](https://github.com/suspensive/react/pulls) | [LICENSE](./LICENSE)

</div>

<br/>
<br/>

# [@suspensive/react](https://docs.suspensive.org/docs/react/README.i18n)

[![npm version](https://img.shields.io/npm/v/@suspensive/react?color=61DAFB)](https://www.npmjs.com/package/@suspensive/react) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@suspensive/react?color=blue) ![npm](https://img.shields.io/npm/dm/@suspensive/react?color=blue)

All declarative components to use suspense on both CSR, SSR.

## Features

- Suspense (containing CSROnly mode)
- ErrorBoundary
- ErrorBoundaryGroup, useErrorBoundaryGroup
- AsyncBoundary (CSROnly mode)
- Delay (Experimental)
- SuspensiveProvider, SuspensiveConfigs (Experimental)
- HOC(Higher Order Component)s for all components

## Installation

```shell
npm install @suspensive/react
```

```shell
yarn add @suspensive/react
```

```shell
pnpm add @suspensive/react
```

## Usage

```tsx
import { Suspense, ErrorBoundary, ErrorBoundaryGroup } from '@suspensive/react'

const Example = (
  <ErrorBoundaryGroup>
    <ErrorBoundaryGroup.Reset trigger={(group) => <Button onClick={group.reset}>Reset All</Button>} />
    <ErrorBoundary fallback={(caught) => <Button onClick={caught.reset}>Reset {caught.error}</Button>}>
      <Suspense fallback={<Spinner />}>
        <SuspendedComponent />
      </Suspense>
    </ErrorBoundary>
    <ErrorBoundary fallback={(caught) => <Button onClick={caught.reset}>Reset {caught.error}</Button>}>
      <Suspense fallback={<Spinner />}>
        <SuspendedComponent />
      </Suspense>
    </ErrorBoundary>
  </ErrorBoundaryGroup>
)
```

<br/>
<br/>

# [@suspensive/react-query](https://docs.suspensive.org/docs/react-query/README.i18n)

[![npm version](https://img.shields.io/npm/v/@suspensive/react-query?color=61DAFB)](https://www.npmjs.com/package/@suspensive/react-query) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@suspensive/react-query?color=blue) ![npm](https://img.shields.io/npm/dm/@suspensive/react-query?color=blue)

Declarative apis to use [@tanstack/react-query with suspense](https://tanstack.com/query/v4/docs/guides/suspense) easily.

## Features

- QueryErrorBoundary, QueryAsyncBoundary
- useSuspenseQuery
- useSuspenseInfiniteQuery

## Installation

```shell
npm install @suspensive/react @suspensive/react-query
```

```shell
yarn add @suspensive/react @suspensive/react-query
```

```shell
pnpm add @suspensive/react @suspensive/react-query
```

## Usage

```tsx
import { Suspense } from '@suspensive/react'
import { QueryErrorBoundary, useSuspenseQuery } from '@suspensive/react-query'

const Example = () => (
  <QueryErrorBoundary fallback={(caught) => <Button onClick={caught.reset}>Reset {caught.error}</Button>}>
    <Suspense fallback={<Spinner />}>
      <SuspendedComponent />
    </Suspense>
  </QueryErrorBoundary>
)

const SuspendedComponent = () => {
  const query = useSuspenseQuery(key, queryFn, options)

  return <>{query.data}</>
}
```

<br/>
<br/>

# Docs [![deployment](https://img.shields.io/github/deployments/suspensive/react/Production%20%E2%80%93%20docs?label=vercel&logo=vercel&logoColor=white)](https://docs.suspensive.org)

We provide Official Docs

See [OFFICIAL DOCS](https://docs.suspensive.org)

<br/>
<br/>

# Visualization [![deployment](https://img.shields.io/github/deployments/suspensive/react/Production%20%E2%80%93%20Visualization?label=vercel&logo=vercel&logoColor=white)](https://visualization.suspensive.org)

Concepts Visualization ready. You can see core concepts of Suspensive visually

See [VISUALIZATION](https://visualization.suspensive.org).

<br/>
<br/>

# License

MIT © Suspensive. See [LICENSE](./LICENSE) for details.

<div align="center">
  <a title="Suspensive" href="https://github.com/suspensive">
    <div style='display:flex; align-items:center;'>
      <img alt="Suspensive" src="https://github.com/suspensive.png" width="24">
      <sup>Suspensive</sup>
    </div>
  </a>
</div>
