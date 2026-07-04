---
name: ssr-client-only
description: >
  SSR control and client-only rendering in @suspensive/react: Suspense
  clientOnly prop to skip SSR per boundary, ClientOnly component, useIsClient
  hook — all useSyncExternalStore-based and hydration-mismatch-safe. Load when
  skipping SSR for a subtree, accessing browser APIs (window, localStorage),
  fixing hydration mismatches, or replacing next/dynamic ssr:false or
  useEffect mounted flags.
metadata:
  type: sub-skill
  library: '@suspensive/react'
  library_version: '3.21.2'
  framework: react
requires:
  - 'react'
sources:
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/react/Suspense.mdx'
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/react/ClientOnly.mdx'
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/react/useIsClient.mdx'
---

# SSR control with clientOnly, ClientOnly, and useIsClient

This skill builds on react. Read ../SKILL.md first for the client-only constraint and the `.with()` HOC pattern.

## Setup

```tsx
'use client'
import { Suspense } from '@suspensive/react'
import { BrowserWidget } from './BrowserWidget'
import { Skeleton } from './Skeleton'

export const Example = () => (
  <Suspense clientOnly fallback={<Skeleton />}>
    <BrowserWidget />
  </Suspense>
)
```

With `clientOnly`, `<Suspense/>` returns `fallback` on the server and `children` on the client. It does not rely on `useEffect` or mount timing — it distinguishes server and client via `getServerSnapshot`/`getSnapshot` from `useSyncExternalStore`, so children are never server-side rendered and there is no hydration mismatch.

## Core Patterns

### Render a browser-API-dependent subtree only on the client

```tsx
'use client'
import { ClientOnly } from '@suspensive/react'

export const Example = () => (
  <ClientOnly fallback={<div>Server fallback</div>}>
    <div>Window width: {window.innerWidth}px</div>
  </ClientOnly>
)
```

`ClientOnly` renders `children` only in the client environment and `fallback` on the server; `ClientOnly.with({ fallback: <div>server</div> }, Component)` is the HOC form.

### Branch on environment with useIsClient

```tsx
'use client'
import { useIsClient } from '@suspensive/react'

export const Example = () => {
  const isClient = useIsClient()

  const handleClick = () => {
    if (isClient) {
      localStorage.setItem('clicked', 'true')
    }
  }

  return <button onClick={handleClick}>Click me</button>
}
```

`useIsClient` returns `false` during SSR and `true` on the client via `useSyncExternalStore` (`getSnapshot: () => true`, `getServerSnapshot: () => false`) — no extra render, no tearing.

### Re-enable SSR gradually

```tsx
'use client'
import { Suspense } from '@suspensive/react'
import { Widget } from './Widget'

// step 1: client-only while the subtree is not SSR-safe
// <Suspense clientOnly fallback={<Skeleton />}><Widget /></Suspense>

// step 2: remove one prop when it becomes SSR-safe
export const Example = () => (
  <Suspense fallback={<Skeleton />}>
    <Widget />
  </Suspense>
)
```

Reverting a client-only boundary to full SSR is deleting the `clientOnly` prop — no file moves or component indirection.

## Common Mistakes

### HIGH useEffect mounted-flag instead of useIsClient/ClientOnly

Wrong:

```tsx
import { useEffect, useState } from 'react'

const Example = ({ children }) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return <>{children}</>
}
```

Correct:

```tsx
import { useIsClient } from '@suspensive/react'

const Example = ({ children }) => {
  const isClient = useIsClient()
  if (!isClient) return null
  return <>{children}</>
}
```

The mounted-flag idiom causes an extra post-mount render and tearing risk; `useIsClient` (and `<ClientOnly fallback={null}>{children}</ClientOnly>`) uses `useSyncExternalStore` with `getServerSnapshot` so server and client snapshots stay consistent.

Source: docs/suspensive.org/src/content/en/docs/react/useIsClient.mdx, docs/suspensive.org/src/content/en/docs/react/ClientOnly.mdx

### HIGH Using removed Suspense.CSROnly

Wrong:

```tsx
import { Suspense } from '@suspensive/react'

const Example = ({ children }) => (
  <Suspense.CSROnly fallback={<Spinner />}>{children}</Suspense.CSROnly>
)
```

Correct:

```tsx
import { Suspense } from '@suspensive/react'

const Example = ({ children }) => (
  <Suspense clientOnly fallback={<Spinner />}>
    {children}
  </Suspense>
)
```

`Suspense.CSROnly` was renamed to the `clientOnly` prop and no longer exists. Fixed/removed in v2 but agents trained on older code still generate this pattern.

Source: docs/suspensive.org/src/content/en/docs/react/migration/migrate-to-v2.mdx

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

In RSC, functions cannot cross the server-to-client serialization boundary; pass JSX as `fallback` and read `error`/`reset` via `useErrorBoundaryFallbackProps` in a client component.

Source: docs/suspensive.org/src/content/en/docs/react/ErrorBoundary.mdx (useErrorBoundaryFallbackProps section)

### MEDIUM next/dynamic ssr:false for a single subtree

Wrong:

```tsx
import dynamic from 'next/dynamic'

const Widget = dynamic(() => import('./Widget'), { ssr: false })
```

Correct:

```tsx
import { Suspense } from '@suspensive/react'
import { Widget } from './Widget'

const Example = () => (
  <Suspense clientOnly fallback={<Skeleton />}>
    <Widget />
  </Suspense>
)
```

`dynamic(..., { ssr: false })` forces a separate file and component indirection; `Suspense clientOnly` achieves the same per-boundary SSR skip inline and can be reverted by removing one prop.

Source: docs/suspensive.org/src/content/en/docs/react/Suspense.mdx (clientOnly section)

### MEDIUM Misreading ClientOnly fallback as an error/loading state

Wrong:

```tsx
import { ClientOnly } from '@suspensive/react'

// expecting this fallback to show while the widget "loads" on every mount
const Example = () => (
  <ClientOnly fallback={<Spinner />}>
    <Widget />
  </ClientOnly>
)
```

Correct:

```tsx
import { ClientOnly } from '@suspensive/react'

// fallback is what the SERVER renders into the HTML — a static placeholder
const Example = () => (
  <ClientOnly fallback={<WidgetPlaceholder />}>
    <Widget />
  </ClientOnly>
)
```

The `ClientOnly` fallback (and `Suspense clientOnly` fallback) is the server-rendered HTML shown only before hydration; it never reappears on later client-side mounts, so it is not a loading or error state.

Source: https://github.com/toss/suspensive/issues/1158, https://github.com/toss/suspensive/issues/873

### HIGH Tension: clientOnly simplicity vs SSR value

Skipping SSR with `clientOnly` is the easiest way to silence a hydration error, but it throws away streaming SSR and server prefetch: a boundary under `clientOnly` renders nothing on the server, so `QueriesHydration`/server prefetch under it is wasted. When the hydration issue comes from server-fetched query data, the correct fix is proper server prefetch + hydration — see the `ssr-hydration` skill in `@suspensive/react-query-4`/`@suspensive/react-query-5`. Conversely, do not build a `QueriesHydration` pipeline for a browser-API widget that should simply be client-only.

See also: the `ssr-hydration` skill in `@suspensive/react-query-4`/`@suspensive/react-query-5` — `clientOnly` on a boundary removes the need for `QueriesHydration` under it (no server prefetch happens).
