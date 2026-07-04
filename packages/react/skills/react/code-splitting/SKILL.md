---
name: code-splitting
description: >
  Safe code splitting with @suspensive/react lazy (experimental): .load()
  preloading, onSuccess/onError callbacks, createLazy for shared defaults,
  reloadOnError({ retry, retryDelay, storage, reload }) to recover from
  chunk-load failures caused by deploy version skew. Load when code-splitting
  routes/components, preloading on hover, or handling "Loading chunk failed"
  errors.
metadata:
  type: sub-skill
  library: '@suspensive/react'
  library_version: '3.21.2'
  framework: react
requires:
  - 'react'
sources:
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/react/lazy.mdx'
  - 'toss/suspensive:packages/react/src/lazy.ts'
---

# Code splitting with lazy, createLazy, and reloadOnError

This skill builds on react. Read ../SKILL.md first for the client-only constraint and the `.with()` HOC pattern.

`lazy`, `createLazy`, and `reloadOnError` are experimental — the interface may change between minor versions. Pin the `@suspensive/react` version and re-check these APIs on upgrade.

## Setup

```tsx
'use client'
import { Suspense, lazy } from '@suspensive/react'

const Settings = lazy(() => import('./Settings'))

export const Example = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Settings />
  </Suspense>
)
```

`lazy` is a drop-in for `React.lazy` that additionally exposes a static `load(): Promise<void>` method and accepts `{ onSuccess, onError }` callbacks as a second argument.

## Core Patterns

### Preload a route component on hover

```tsx
'use client'
import { Suspense, lazy } from '@suspensive/react'
import { useState } from 'react'

const Settings = lazy(() => import('./Settings'))

export const Example = () => {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button onMouseEnter={() => Settings.load()} onClick={() => setOpen(true)}>
        Open settings
      </button>
      {open && (
        <Suspense fallback={<div>Loading...</div>}>
          <Settings />
        </Suspense>
      )}
    </div>
  )
}
```

`Component.load()` fetches the chunk without rendering, so the component mounts instantly when it is actually shown.

### Auto-reload when a deploy invalidates old chunks

```tsx
'use client'
import { lazy, reloadOnError } from '@suspensive/react'

const CheckoutPage = lazy(
  () => import('./CheckoutPage'),
  reloadOnError({ retry: 3, retryDelay: 1000 })
)
```

`reloadOnError` returns a `LazyOptions` object whose `onError` reloads the page (default `window.location.reload`) up to `retry` times with `retryDelay` ms between attempts, tracking the count in storage (default `window.sessionStorage`) to avoid infinite reload loops; `onSuccess` clears the count.

### Shared defaults for every lazy component via createLazy

```tsx
'use client'
import { createLazy, reloadOnError } from '@suspensive/react'

const lazy = createLazy(reloadOnError({ retry: 1, retryDelay: 1000 }))

const Page = lazy(() => import('./Page'))
const Modal = lazy(() => import('./Modal'), {
  onError: ({ error }) => console.error('Modal chunk failed:', error),
})
```

`createLazy(defaultOptions)` returns a `lazy` with baked-in defaults; per-component callbacks run first, then the defaults (individual `onError` → default `onError`).

### Custom storage and reload function

```tsx
'use client'
import { createLazy, reloadOnError } from '@suspensive/react'

const lazy = createLazy(
  reloadOnError({
    retry: 5,
    retryDelay: 2000,
    storage: {
      getItem: (key) => localStorage.getItem(key),
      setItem: (key, value) => localStorage.setItem(key, value),
      removeItem: (key) => localStorage.removeItem(key),
    },
    reload: () => {
      window.location.href = window.location.href
    },
  })
)

const Component = lazy(() => import('./Component'))
```

## Common Mistakes

### MEDIUM React.lazy with no chunk-failure recovery

Wrong:

```tsx
import { lazy } from 'react'

const Page = lazy(() => import('./Page'))
```

Correct:

```tsx
import { createLazy, reloadOnError } from '@suspensive/react'

const lazy = createLazy(reloadOnError({ retry: 1 }))
const Page = lazy(() => import('./Page'))
```

After a deploy, stale HTML requests old hashed chunks and `React.lazy` rejects forever until a manual refresh; `reloadOnError` retries then reloads, using storage to avoid reload loops.

Source: docs/suspensive.org/src/content/en/docs/react/lazy.mdx

### MEDIUM Passing reloadOnError as the onError callback

Wrong:

```tsx
import { createLazy, reloadOnError } from '@suspensive/react'

const lazy = createLazy({ onError: reloadOnError({ retry: 1 }) })
```

Correct:

```tsx
import { createLazy, reloadOnError } from '@suspensive/react'

const lazy = createLazy(reloadOnError({ retry: 1 }))
```

`reloadOnError(options)` returns a whole `LazyOptions` object (`{ onSuccess, onError }`), not an `onError` callback — nesting it under `onError` never triggers a reload and silently drops the success-side count reset.

Source: packages/react/src/lazy.ts (reloadOnError returns LazyOptions)

### MEDIUM Treating the lazy interface as stable

Wrong:

```tsx
// building a shared wrapper library on lazy/createLazy/reloadOnError
// and upgrading @suspensive/react minors without checking these APIs
import { createLazy, reloadOnError } from '@suspensive/react'

export const appLazy = createLazy(reloadOnError({ retry: 3 }))
```

Correct:

```tsx
// same code, but pin the version and re-verify on every upgrade:
// "@suspensive/react": "3.21.2" (exact), and check the lazy docs in release notes
import { createLazy, reloadOnError } from '@suspensive/react'

export const appLazy = createLazy(reloadOnError({ retry: 3 }))
```

`lazy`/`createLazy`/`reloadOnError` are marked experimental; the interface may change between minor versions, so version upgrades can break call sites without a major bump.

Source: docs/suspensive.org/src/content/en/docs/react/lazy.mdx (experimental callout)
