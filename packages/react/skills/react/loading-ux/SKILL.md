---
name: loading-ux
description: >
  Loading UX without flash-of-loading in @suspensive/react: Suspense fallback,
  Delay (ms, fallback, isDelayed render prop) to hold back spinners and fade
  skeletons in, DefaultPropsProvider + new DefaultProps for app-wide default
  fallbacks. Load when writing Suspense fallbacks, skeletons, spinners, or
  global loading defaults.
metadata:
  type: sub-skill
  library: '@suspensive/react'
  library_version: '3.21.2'
  framework: react
requires:
  - 'react'
sources:
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/react/Suspense.mdx'
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/react/Delay.mdx'
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/react/DefaultPropsProvider.mdx'
  - 'toss/suspensive:packages/react/src/Delay.tsx'
---

# Loading UX with Suspense, Delay, and DefaultPropsProvider

This skill builds on react. Read ../SKILL.md first for the client-only constraint and the `.with()` HOC pattern.

## Setup

```tsx
'use client'
import { Delay, Suspense } from '@suspensive/react'
import { Content } from './Content'
import { Spinner } from './Spinner'

export const Example = () => (
  <Suspense
    fallback={
      <Delay ms={200}>
        <Spinner />
      </Delay>
    }
  >
    <Content />
  </Suspense>
)
```

`Delay` postpones exposing its children by `ms` — if `Content` resolves within 200ms, the user never sees the spinner. Recommended `ms`: 100–300 for most UI, 500+ for non-critical sections.

`DelayProps` is a union: either `{ ms?, fallback?: ReactNode, children?: ReactNode }` or `{ ms?, children?: ({ isDelayed }) => ReactNode }` (no `fallback` allowed with a render-prop child).

## Core Patterns

### Fade the skeleton in with the isDelayed render prop

```tsx
'use client'
import { Delay, Suspense } from '@suspensive/react'
import { Content } from './Content'
import { Skeleton } from './Skeleton'

export const Example = () => (
  <Suspense
    fallback={
      <Delay ms={200}>
        {({ isDelayed }) => (
          <Skeleton
            style={{ opacity: isDelayed ? 1 : 0, transition: 'opacity 200ms' }}
          />
        )}
      </Delay>
    }
  >
    <Content />
  </Suspense>
)
```

When `children` is a render prop, `Delay` always renders it and flips `isDelayed` to `true` after `ms`, enabling opacity transitions instead of an abrupt pop-in (available since v3.12).

### Show an interim fallback before the delayed children

```tsx
'use client'
import { Delay } from '@suspensive/react'

export const Example = () => (
  <Delay ms={200} fallback={<>Almost there...</>}>
    200ms delayed content
  </Delay>
)
```

### One default fallback for every Suspense and Delay in the app

```tsx
'use client'
import { DefaultProps, DefaultPropsProvider, Suspense } from '@suspensive/react'
import { Page } from './Page'
import { Spinner } from './Spinner'

const defaultProps = new DefaultProps({
  Delay: { ms: 1200 },
  Suspense: { fallback: <Spinner />, clientOnly: false },
})

export const App = () => (
  <DefaultPropsProvider defaultProps={defaultProps}>
    <Suspense>
      <Page />
    </Suspense>
  </DefaultPropsProvider>
)
```

`<Suspense>` and `<Delay>` without explicit props read defaults from the nearest provider; per-component props always win.

## Common Mistakes

### MEDIUM Hand-rolling spinner delay with useState/useEffect/setTimeout

Wrong:

```tsx
import { useEffect, useState } from 'react'

const DelayedSpinner = () => {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 200)
    return () => clearTimeout(t)
  }, [])
  return show ? <Spinner /> : null
}
```

Correct:

```tsx
import { Delay, Suspense } from '@suspensive/react'

const Example = ({ children }) => (
  <Suspense
    fallback={
      <Delay ms={200}>
        <Spinner />
      </Delay>
    }
  >
    {children}
  </Suspense>
)
```

`Delay` does the timeout declaratively, composes inside any Suspense fallback, and picks up default `ms` from `DefaultPropsProvider`.

Source: docs/suspensive.org/src/content/en/docs/react/Delay.mdx

### MEDIUM Passing a plain object to DefaultPropsProvider

Wrong:

```tsx
import { DefaultPropsProvider } from '@suspensive/react'

const App = ({ children }) => (
  <DefaultPropsProvider defaultProps={{ Suspense: { fallback: <Spinner /> } }}>
    {children}
  </DefaultPropsProvider>
)
```

Correct:

```tsx
import { DefaultProps, DefaultPropsProvider } from '@suspensive/react'

const defaultProps = new DefaultProps({ Suspense: { fallback: <Spinner /> } })

const App = ({ children }) => (
  <DefaultPropsProvider defaultProps={defaultProps}>
    {children}
  </DefaultPropsProvider>
)
```

`defaultProps` must be an instance of the `DefaultProps` class; a plain object literal is not accepted.

Source: docs/suspensive.org/src/content/en/docs/react/DefaultPropsProvider.mdx

### MEDIUM Abrupt skeleton-to-content swap instead of isDelayed fade

Wrong:

```tsx
import { Delay } from '@suspensive/react'

// plus a separate hand-written fade-in component around Spinner
const Fallback = () => (
  <Delay ms={200}>
    <FadeIn>
      <Spinner />
    </FadeIn>
  </Delay>
)
```

Correct:

```tsx
import { Delay } from '@suspensive/react'

const Fallback = () => (
  <Delay ms={200}>
    {({ isDelayed }) => (
      <Spinner
        style={{ opacity: isDelayed ? 1 : 0, transition: 'opacity 200ms' }}
      />
    )}
  </Delay>
)
```

The render-prop child receives `isDelayed` (v3.12+) exactly for this; agents unaware of it wire CSS animation components by hand.

Source: docs/suspensive.org/src/content/en/docs/react/Delay.mdx (#1312)

### MEDIUM Reading Delay ms as extending fallback display time

Wrong:

```tsx
import { Delay, Suspense } from '@suspensive/react'

// expecting the spinner to stay visible for at least 3s
const Example = ({ children }) => (
  <Suspense
    fallback={
      <Delay ms={3000}>
        <Spinner />
      </Delay>
    }
  >
    {children}
  </Suspense>
)
```

Correct:

```tsx
import { Delay, Suspense } from '@suspensive/react'

// ms only postpones when the spinner APPEARS; content replaces it as soon as it resolves
const Example = ({ children }) => (
  <Suspense
    fallback={
      <Delay ms={200}>
        <Spinner />
      </Delay>
    }
  >
    {children}
  </Suspense>
)
```

`Delay` postpones exposing its children/fallback; it never prolongs how long a fallback stays visible — a 1s fetch with `ms={3000}` shows no spinner at all, not 4s of spinner.

Source: https://github.com/toss/suspensive/issues/182

See also: the `declarative-queries` skill in `@suspensive/react-query-4`/`@suspensive/react-query-5` — `Delay` composes inside Suspense fallbacks that wrap `SuspenseQuery`.
