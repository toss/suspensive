---
name: error-handling
description: >
  Layered error handling with @suspensive/react: ErrorBoundary (fallback,
  shouldCatch, resetKeys, onReset, onError), ErrorBoundary.Consumer,
  useErrorBoundary().setError, useErrorBoundaryFallbackProps,
  ErrorBoundaryGroup, ErrorBoundaryGroup.Consumer, blockOutside,
  useErrorBoundaryGroup, ErrorBoundaryFallbackProps type. Load when catching,
  filtering, resetting, or propagating render errors.
metadata:
  type: sub-skill
  library: '@suspensive/react'
  library_version: '3.21.2'
  framework: react
requires:
  - 'react'
sources:
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/react/ErrorBoundary.mdx'
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/react/ErrorBoundaryGroup.mdx'
  - 'toss/suspensive:packages/react/src/ErrorBoundary.tsx'
---

# Error handling with ErrorBoundary and ErrorBoundaryGroup

This skill builds on react. Read ../SKILL.md first for the client-only constraint, the `.with()` HOC pattern, and removed legacy APIs.

## Setup

```tsx
'use client'
import { ErrorBoundary } from '@suspensive/react'
import { UserProfile } from './UserProfile'

export const UserSection = () => (
  <ErrorBoundary
    fallback={({ error, reset }) => (
      <div>
        <p>{error.message}</p>
        <button onClick={reset}>Try again</button>
      </div>
    )}
    onError={(error, info) => console.error(error, info)}
    onReset={() => console.log('reset')}
  >
    <UserProfile />
  </ErrorBoundary>
)
```

`fallback` is the single fallback prop (element or `({ error, reset }) => ReactNode`). Type a standalone fallback component with `ErrorBoundaryFallbackProps`.

## Core Patterns

### Catch only one error type, let the rest propagate

```tsx
'use client'
import { ErrorBoundary } from '@suspensive/react'
import { NetworkError } from './errors'
import { Feed } from './Feed'

export const Example = () => (
  <ErrorBoundary fallback={({ error }) => <p>Unexpected: {error.message}</p>}>
    <ErrorBoundary
      shouldCatch={NetworkError}
      fallback={({ error, reset }) => (
        <button onClick={reset}>Network failed, retry: {error.message}</button>
      )}
    >
      <Feed />
    </ErrorBoundary>
  </ErrorBoundary>
)
```

`shouldCatch` accepts an ErrorConstructor, a callback `(error) => boolean`, a boolean, or an array mixing all three; uncaught errors propagate to the parent boundary.

### Reset every boundary on the page at once

```tsx
'use client'
import { ErrorBoundary, ErrorBoundaryGroup } from '@suspensive/react'
import { StatsSection, UserSection } from './sections'

export const Dashboard = () => (
  <ErrorBoundaryGroup>
    <ErrorBoundaryGroup.Consumer>
      {(group) => <button onClick={group.reset}>Reset all</button>}
    </ErrorBoundaryGroup.Consumer>
    <ErrorBoundary fallback={({ error }) => <p>{error.message}</p>}>
      <UserSection />
    </ErrorBoundary>
    <ErrorBoundary fallback={({ error }) => <p>{error.message}</p>}>
      <StatsSection />
    </ErrorBoundary>
  </ErrorBoundaryGroup>
)
```

Nested groups are also reset by the parent group unless they set `blockOutside`; `useErrorBoundaryGroup().reset` does the same from any child component.

### Trigger the boundary without throwing during render

```tsx
'use client'
import { ErrorBoundary, useErrorBoundary } from '@suspensive/react'
import { useEffect } from 'react'
import { fetchSomething } from './api'

const SetErrorAfterFetch = () => {
  const errorBoundary = useErrorBoundary()

  useEffect(() => {
    fetchSomething().then(
      (response) => {},
      (error) => errorBoundary.setError(error)
    )
  }, [])

  return <>No error</>
}

export const Example = () => (
  <ErrorBoundary fallback={({ error }) => <p>{error.message}</p>}>
    <SetErrorAfterFetch />
  </ErrorBoundary>
)
```

`setError` routes async (event/effect) errors — which React error boundaries cannot catch via throw — into the nearest `ErrorBoundary`; `ErrorBoundary.Consumer` exposes the same object inline in JSX.

### Read error and reset inside a fallback without prop drilling

```tsx
'use client'
import { ErrorBoundary, useErrorBoundaryFallbackProps } from '@suspensive/react'
import { Feed } from './Feed'

const ErrorBoundaryFallback = () => {
  const { error, reset } = useErrorBoundaryFallbackProps()

  return (
    <div>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  )
}

export const Example = () => (
  <ErrorBoundary fallback={<ErrorBoundaryFallback />}>
    <Feed />
  </ErrorBoundary>
)
```

## Common Mistakes

### HIGH Using react-error-boundary prop interface on Suspensive ErrorBoundary

Wrong:

```tsx
import { ErrorBoundary } from '@suspensive/react'

const Example = () => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onResetKeysChange={handleChange}
  >
    <Feed />
  </ErrorBoundary>
)
```

Correct:

```tsx
import { ErrorBoundary } from '@suspensive/react'

const Example = () => (
  <ErrorBoundary
    fallback={({ error, reset }) => (
      <ErrorFallback error={error} onRetry={reset} />
    )}
  >
    <Feed />
  </ErrorBoundary>
)
```

Suspensive has a single unified `fallback` prop (no `FallbackComponent`/`fallbackRender`/`onResetKeysChange`), and reset is exposed as `reset` in fallback props, not `resetErrorBoundary`.

Source: docs/suspensive.org/src/content/en/docs/react/comparison.mdx

### HIGH Expecting fallback errors to re-render the same fallback

Wrong:

```tsx
import { ErrorBoundary } from '@suspensive/react'

// assuming this boundary catches its own fallback's errors forever
const Example = ({ children }) => (
  <ErrorBoundary fallback={<BrokenFallback />}>{children}</ErrorBoundary>
)
```

Correct:

```tsx
import { ErrorBoundary } from '@suspensive/react'

// wrap with a parent boundary to catch fallback errors
const Example = ({ children }) => (
  <ErrorBoundary fallback={<LastResort />}>
    <ErrorBoundary fallback={<BrokenFallback />}>{children}</ErrorBoundary>
  </ErrorBoundary>
)
```

Since v3, an error thrown inside a fallback propagates to the parent ErrorBoundary instead of recursively re-rendering the same fallback (the react-error-boundary and Suspensive v2 behavior) — agents trained on v2/react-error-boundary assume the old recursive behavior.

Source: docs/suspensive.org/src/content/en/docs/react/migration/migrate-to-v3.mdx (#1409)

### HIGH Calling useErrorBoundaryFallbackProps outside a fallback

Wrong:

```tsx
import { ErrorBoundary, useErrorBoundaryFallbackProps } from '@suspensive/react'

const Child = () => {
  const { reset } = useErrorBoundaryFallbackProps() // throws
  return <button onClick={reset}>retry</button>
}

const Example = () => (
  <ErrorBoundary fallback={<Fallback />}>
    <Child />
  </ErrorBoundary>
)
```

Correct:

```tsx
import { ErrorBoundary, useErrorBoundaryFallbackProps } from '@suspensive/react'

const Fallback = () => {
  const { error, reset } = useErrorBoundaryFallbackProps()
  return <button onClick={reset}>{error.message}</button>
}

const Example = ({ children }) => (
  <ErrorBoundary fallback={<Fallback />}>{children}</ErrorBoundary>
)
```

The hook throws a runtime error when called in `children` or outside an `ErrorBoundary`; it is only valid inside the `fallback` element.

Source: docs/suspensive.org/src/content/en/docs/react/ErrorBoundary.mdx (warning callout)

### HIGH Passing callback fallback from a Server Component

Wrong:

```tsx
// app/page.tsx — Server Component
import { ErrorBoundary } from '@suspensive/react'

export default function Page() {
  return (
    <ErrorBoundary fallback={({ error }) => <p>{error.message}</p>}>
      <Content />
    </ErrorBoundary>
  )
}
```

Correct:

```tsx
// app/page.tsx — Server Component
import { ErrorBoundary } from '@suspensive/react'
import { ErrorFallbackClient } from './ErrorFallbackClient'

export default function Page() {
  return (
    <ErrorBoundary fallback={<ErrorFallbackClient />}>
      <Content />
    </ErrorBoundary>
  )
}
```

```tsx
// ErrorFallbackClient.tsx
'use client'
import { useErrorBoundaryFallbackProps } from '@suspensive/react'

export const ErrorFallbackClient = () => {
  const { error, reset } = useErrorBoundaryFallbackProps()
  return <button onClick={reset}>{error.message}</button>
}
```

In RSC, functions cannot cross the server-to-client boundary; pass JSX as `fallback` and read `error`/`reset` via `useErrorBoundaryFallbackProps` in a client component.

Source: docs/suspensive.org/src/content/en/docs/react/ErrorBoundary.mdx (useErrorBoundaryFallbackProps section)

### HIGH Expecting ErrorBoundary to reset itself on remount

Wrong:

```tsx
import { ErrorBoundary } from '@suspensive/react'

// navigating away and back, expecting the boundary to be clean
const Example = ({ children }) => (
  <ErrorBoundary fallback={<ErrorUI />}>{children}</ErrorBoundary>
)
```

Correct:

```tsx
import { ErrorBoundary } from '@suspensive/react'
import { useLocation } from 'react-router-dom'

const Example = ({ children }) => {
  const location = useLocation()
  return (
    <ErrorBoundary
      resetKeys={[location.key]}
      fallback={({ reset }) => <button onClick={reset}>retry</button>}
    >
      {children}
    </ErrorBoundary>
  )
}
```

A caught error persists across remounts by design — reset explicitly via the fallback's `reset`, `resetKeys`, or `ErrorBoundaryGroup`; when the error came from a query, the query error cache must be reset too (`onReset={useQueryErrorResetBoundary().reset}`).

Source: https://github.com/toss/suspensive/issues/91

### MEDIUM Manually filtering errors by rethrowing inside fallback

Wrong:

```tsx
import { ErrorBoundary } from '@suspensive/react'
import { NetworkError } from './errors'

const Example = ({ children }) => (
  <ErrorBoundary
    fallback={({ error }) => {
      if (!(error instanceof NetworkError)) throw error
      return <NetworkErrorUI />
    }}
  >
    {children}
  </ErrorBoundary>
)
```

Correct:

```tsx
import { ErrorBoundary } from '@suspensive/react'
import { NetworkError } from './errors'

const Example = ({ children }) => (
  <ErrorBoundary shouldCatch={NetworkError} fallback={<NetworkErrorUI />}>
    {children}
  </ErrorBoundary>
)
```

`shouldCatch` filters declaratively before the boundary catches, keeps TypeScript error narrowing, and avoids relying on fallback-rethrow semantics (which changed in v3).

Source: docs/suspensive.org/src/content/en/docs/react/ErrorBoundary.mdx (shouldCatch section)

### MEDIUM Assuming caught values are always Error instances

Wrong:

```tsx
import { ErrorBoundary } from '@suspensive/react'

const Example = ({ children }) => (
  <ErrorBoundary fallback={({ error }) => <p>{error.message}</p>}>
    {children}
  </ErrorBoundary>
)
```

Correct:

```tsx
import { ErrorBoundary } from '@suspensive/react'

const Example = ({ children }) => (
  <ErrorBoundary
    fallback={({ error }) => (
      <p>{error instanceof Error ? error.message : String(error)}</p>
    )}
  >
    {children}
  </ErrorBoundary>
)
```

Thrown strings and plain objects reach the fallback as-is, so fallback code assuming `error.message` renders `undefined` (or crashes) on non-Error throws.

Source: https://github.com/toss/suspensive/issues/1785

See also: [migrate-to-v3](../../lifecycle/migrate-to-v3/SKILL.md) — v3 changed fallback error propagation semantics.
See also: the `suspensive-react` composition skill in `@suspensive/react-query-4`/`@suspensive/react-query-5` — the removed `QueryErrorBoundary` replacement is `ErrorBoundary` + `useQueryErrorResetBoundary`, and `shouldCatch` layering applies to API error types.
