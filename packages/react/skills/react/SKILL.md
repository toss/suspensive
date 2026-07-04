---
name: react
description: >
  Core skill for @suspensive/react: Suspense (clientOnly prop), ErrorBoundary
  (fallback, shouldCatch, resetKeys, onError, onReset), ErrorBoundaryGroup,
  Delay, ClientOnly, useIsClient, useErrorBoundary, useErrorBoundaryFallbackProps,
  DefaultPropsProvider/DefaultProps, lazy/createLazy/reloadOnError, and the
  shared .with() HOC pattern. Load when code imports '@suspensive/react' or
  needs declarative Suspense boundaries, error boundaries, loading fallbacks,
  or client-only rendering in React 18+.
metadata:
  type: core
  library: '@suspensive/react'
  library_version: '3.21.2'
  framework: react
sources:
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/react/motivation.mdx'
  - 'toss/suspensive:packages/react/src/index.ts'
---

# @suspensive/react

`@suspensive/react` provides declarative components and hooks that fill gaps in React's built-in Suspense, error boundary, and lazy primitives. Runtime exports: `Suspense`, `ErrorBoundary`, `ErrorBoundaryGroup`, `Delay`, `ClientOnly`, `DefaultPropsProvider`, `DefaultProps`, `lazy`, `createLazy`, `reloadOnError`, `useErrorBoundary`, `useErrorBoundaryFallbackProps`, `useErrorBoundaryGroup`, `useIsClient`. Type exports: `SuspenseProps`, `ErrorBoundaryProps`, `ErrorBoundaryFallbackProps`, `ErrorBoundaryGroupProps`, `DelayProps`, `ClientOnlyProps`. Requires React >= 18 (native `useSyncExternalStore`).

Every component (`Suspense`, `ErrorBoundary`, `ErrorBoundaryGroup`, `Delay`, `ClientOnly`) exposes a static `.with(props, Component)` HOC that wraps `Component` with that boundary.

> **CRITICAL**: All Suspensive components are client components (`'use client'`). Never render them directly in a React Server Component — render-prop children are functions, which cannot cross the RSC serialization boundary. Put them inside a component marked `'use client'`.

> **CRITICAL**: These APIs were removed and must never be generated: the `wrap` builder (`wrap.ErrorBoundary(...).Suspense(...).on(...)`, removed in v3 — use `.with()`), `AsyncBoundary` and the `withSuspense`/`withDelay`/`withErrorBoundary`/`withErrorBoundaryGroup` HOCs (removed in v2 — compose `ErrorBoundary` + `Suspense` or use `.with()`), `Suspense.CSROnly` (removed in v2 — use the `clientOnly` prop), and `ErrorBoundaryGroup.Reset` (removed in v2 — use `ErrorBoundaryGroup.Consumer`). Agents trained on older code still generate all of these. See [migrate-to-v3](../lifecycle/migrate-to-v3/SKILL.md).

> **CRITICAL**: The component returned by `.with()` rejects extra static properties (router `loader`s etc.) at the type level. Attach statics with `Object.assign(Suspense.with(props, Component), { loader })`, not direct assignment.

## Sub-Skills

| Task                                                                       | Skill                                                |
| -------------------------------------------------------------------------- | ---------------------------------------------------- |
| Catch specific error types, reset one or many boundaries, fallback props   | [error-handling](./error-handling/SKILL.md)          |
| Suspense fallbacks, prevent flash-of-loading with Delay, app-wide defaults | [loading-ux](./loading-ux/SKILL.md)                  |
| Skip SSR per boundary, hydration-safe client detection                     | [ssr-client-only](./ssr-client-only/SKILL.md)        |
| Preload lazy components, recover from chunk-load failures after deploys    | [code-splitting](./code-splitting/SKILL.md)          |
| Upgrade from v1/v2 (`wrap`, `AsyncBoundary`, `with*` HOCs, codemods)       | [migrate-to-v3](../lifecycle/migrate-to-v3/SKILL.md) |

## Quick Decision Tree

```
Need to...
├─ catch render errors / filter by error type / reset boundaries
│    → error-handling (ErrorBoundary, shouldCatch, ErrorBoundaryGroup)
├─ show a loading fallback / avoid a 50ms spinner flash / set one default fallback
│    → loading-ux (Suspense, Delay, DefaultPropsProvider)
├─ skip SSR for a subtree / read browser APIs without hydration mismatch
│    → ssr-client-only (Suspense clientOnly, ClientOnly, useIsClient)
├─ code-split with preloading / survive stale-chunk errors after a deploy
│    → code-splitting (lazy, createLazy, reloadOnError)
└─ upgrade code that uses wrap / AsyncBoundary / withSuspense / Suspense.CSROnly
     → migrate-to-v3 (codemods, old→new API table)
```

## Minimal Working Example

```tsx
'use client'
import { Delay, ErrorBoundary, Suspense } from '@suspensive/react'
import { UserProfile } from './UserProfile'

export const UserSection = () => (
  <ErrorBoundary
    fallback={({ error, reset }) => (
      <div>
        <p>{error.message}</p>
        <button onClick={reset}>Try again</button>
      </div>
    )}
  >
    <Suspense
      fallback={
        <Delay ms={200}>
          <div>Loading...</div>
        </Delay>
      }
    >
      <UserProfile />
    </Suspense>
  </ErrorBoundary>
)
```

The same tree with the `.with()` HOC pattern:

```tsx
'use client'
import { ErrorBoundary, Suspense } from '@suspensive/react'
import { UserProfile } from './UserProfile'

export const UserSection = ErrorBoundary.with(
  { fallback: ({ error }) => <p>{error.message}</p> },
  Suspense.with({ fallback: <div>Loading...</div> }, () => <UserProfile />)
)
```

## Common Mistakes

### HIGH Rendering Suspensive components in a Server Component

Wrong:

```tsx
// app/page.tsx — Server Component
import { Suspense } from '@suspensive/react'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  )
}
```

Correct:

```tsx
// app/page.tsx — Server Component
import { ContentSection } from './ContentSection'

export default function Page() {
  return <ContentSection />
}
```

```tsx
// ContentSection.tsx
'use client'
import { Suspense } from '@suspensive/react'
import { Content } from './Content'

export const ContentSection = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Content />
  </Suspense>
)
```

All Suspensive components are client-only (`'use client'`), so using them directly in an RSC fails the build or errors at render.

Source: https://github.com/toss/suspensive/issues/1563

### MEDIUM Attaching static properties to .with() result directly

Wrong:

```tsx
import { Suspense } from '@suspensive/react'

const Page = Suspense.with({ fallback: <div>Loading...</div> }, PageComponent)
Page.loader = loader // type error
export default Page
```

Correct:

```tsx
import { Suspense } from '@suspensive/react'

export default Object.assign(Suspense.with({ fallback: <div>Loading...</div> }, PageComponent), { loader })
```

The component type returned by `.with()` rejects extra static properties, so router loaders and similar statics must be merged with `Object.assign`.

Source: https://github.com/toss/suspensive/issues/1665

## Version

Targets `@suspensive/react` v3.21.2. Requires React >= 18.0.
