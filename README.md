<div align="center">
  <a href="https://suspensive.org" title="Suspensive - All in one for React Suspense">
    <img src="https://github.com/toss/suspensive/blob/main/docs/suspensive.org/public/img/banner.png?raw=true" alt="Suspensive — All-in-one for React Suspense" height="400" />
  </a>
  <p>
    <a href="https://www.npmjs.com/package/@suspensive/react"><img src="https://img.shields.io/npm/v/@suspensive/react.svg?style=flat-square&colorA=000&colorB=000" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/@suspensive/react"><img src="https://img.shields.io/npm/dw/@suspensive/react.svg?style=flat-square&colorA=000&colorB=000" alt="npm downloads" /></a>
    <a href="https://github.com/toss/suspensive"><img src="https://img.shields.io/github/stars/toss/suspensive?style=flat-square&colorA=000&colorB=000" alt="GitHub stars" /></a>
    <a href="https://github.com/toss/suspensive/blob/main/LICENSE"><img src="https://img.shields.io/github/license/toss/suspensive?style=flat-square&colorA=000&colorB=000" alt="MIT License" /></a>
  </p>
</div>

## What is Suspensive?

React gives you Suspense, lazy, and an interface to build Error Boundaries — but using them in real applications reveals gaps. **Suspensive fills those gaps** with declarative components and hooks.

```tsx
import { Delay, ErrorBoundary, ErrorBoundaryGroup, Suspense } from '@suspensive/react'

const Page = () => (
  <ErrorBoundaryGroup>
    <ErrorBoundaryGroup.Consumer>
      {({ reset }) => <button onClick={reset}>Reset All</button>}
    </ErrorBoundaryGroup.Consumer>
    <ErrorBoundary
      shouldCatch={NetworkError}
      fallback={({ error, reset }) => <ErrorUI error={error} onRetry={reset} />}
    >
      <Suspense
        clientOnly
        fallback={
          <Delay ms={200}>
            {({ isDelayed }) => <Spinner style={{ opacity: isDelayed ? 1 : 0, transition: 'opacity 200ms' }} />}
          </Delay>
        }
      >
        <Content />
      </Suspense>
    </ErrorBoundary>
  </ErrorBoundaryGroup>
)
```

- **`shouldCatch`** — catch only specific error types, let others propagate
- **`ErrorBoundaryGroup`** — reset multiple error boundaries at once, no prop drilling
- **`clientOnly`** — SSR-safe Suspense that avoids hydration mismatches in Next.js
- **`Delay`** — prevent flash-of-loading-state with render props for smooth fade-in
- **`reset`** — built into the fallback props, no external state needed

## Packages

| Package                                                                       | Description                                                    | Version                                                                                                                                                       |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [@suspensive/react](https://suspensive.org/docs/react/motivation)             | Suspense, ErrorBoundary, ErrorBoundaryGroup, Delay, ClientOnly | [![npm](https://img.shields.io/npm/v/@suspensive/react?style=flat-square&colorA=000&colorB=000)](https://www.npmjs.com/package/@suspensive/react)             |
| [@suspensive/react-query](https://suspensive.org/docs/react-query/motivation) | SuspenseQuery, SuspenseInfiniteQuery, Mutation, PrefetchQuery  | [![npm](https://img.shields.io/npm/v/@suspensive/react-query?style=flat-square&colorA=000&colorB=000)](https://www.npmjs.com/package/@suspensive/react-query) |
| [@suspensive/jotai](https://suspensive.org/docs/jotai/motivation)             | Atom, AtomValue, SetAtom for Jotai integration                 | [![npm](https://img.shields.io/npm/v/@suspensive/jotai?style=flat-square&colorA=000&colorB=000)](https://www.npmjs.com/package/@suspensive/jotai)             |
| [@suspensive/codemods](https://suspensive.org/docs/codemods/motivation)       | Automated migration codemods                                   | [![npm](https://img.shields.io/npm/v/@suspensive/codemods?style=flat-square&colorA=000&colorB=000)](https://www.npmjs.com/package/@suspensive/codemods)       |

## Key Features

- **`<ErrorBoundary/>`** with `shouldCatch` — catch only the errors you want ([comparison with react-error-boundary](https://suspensive.org/docs/react/comparison))
- **`<ErrorBoundaryGroup/>`** — reset multiple error boundaries at once, no prop drilling
- **`<Suspense/>`** with `clientOnly` — SSR-safe Suspense that just works in Next.js
- **`<SuspenseQuery/>`** — declarative data fetching as JSX, no hook constraints
- **`<Delay/>`** — prevent flash-of-loading-state UX issues
- **`<DefaultPropsProvider/>`** — set global default fallbacks for all components

## Getting Started

```bash
npm install @suspensive/react
```

Visit **[suspensive.org](https://suspensive.org)** for full documentation.

[English](https://suspensive.org/en) | [한국어](https://suspensive.org/ko)

## Contributors

Read our [Contributing Guide](./CONTRIBUTING.md) to familiarize yourself with Suspensive's development process, how to suggest bug fixes and improvements, and the steps for building and testing your changes.

<a href="https://github.com/toss/suspensive/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=toss/suspensive" />
</a>

<br/>
<br/>

<a title="Toss" href="https://toss.im">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://static.toss.im/logos/png/4x/logo-toss-reverse.png">
    <img alt="Toss" src="https://static.toss.im/logos/png/4x/logo-toss.png" width="100">
  </picture>
</a>

MIT © Viva Republica, Inc. See [LICENSE](./LICENSE) for details.
