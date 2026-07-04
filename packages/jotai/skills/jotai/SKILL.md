---
name: jotai
description: >
  Render-prop components for Jotai atoms: Atom ([value, setValue] like
  useAtom), AtomValue (read-only like useAtomValue), SetAtom (write-only like
  useSetAtom) from @suspensive/jotai. Load when reading or writing jotai atoms
  declaratively in JSX, when async atoms need Suspense boundaries, or when
  using jotai extensions (jotai-tanstack-query atomWithSuspenseQuery,
  jotai-cache) with Suspense.
metadata:
  type: core
  library: '@suspensive/jotai'
  library_version: '3.21.2'
  framework: react
sources:
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/jotai/Atom.mdx'
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/jotai/AtomValue.mdx'
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/jotai/SetAtom.mdx'
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/jotai/motivation.mdx'
  - 'toss/suspensive:packages/jotai/src/index.ts'
---

# @suspensive/jotai

@suspensive/jotai exports three components — `Atom`, `AtomValue`, and
`SetAtom` — that wrap Jotai's `useAtom`, `useAtomValue`, and `useSetAtom`
hooks as render-prop components. Each takes an `atom` prop (any Jotai atom,
used as is), an optional `options` prop (forwarded to the underlying hook,
e.g. `{ store }`), and a function as `children` that receives the hook's
return value. This makes it visible in JSX which atoms a subtree uses and
which of them trigger Suspense, and lets atoms be read or written inline
(inside list rows, conditionals) where hooks would force extracting a
component. Peer dependencies: `jotai@^2`, `react@^18 || ^19`.

> **CRITICAL**: All three components are client-only (`'use client'`;
> render-prop children are functions and cannot cross the RSC serialization
> boundary). Async atoms suspend — reading an async atom via `Atom`/`AtomValue`,
> or writing a Promise via `SetAtom`, delegates the pending state to the
> nearest parent Suspense boundary, so one must exist above the component.

## Setup

```shell
npm install @suspensive/jotai jotai
```

```tsx
import { Atom } from '@suspensive/jotai'
import { atom } from 'jotai'

const countAtom = atom(1)

const Example = () => (
  <Atom atom={countAtom}>
    {([count, setCount]) => (
      <>
        <div>count: {count}</div>
        <button onClick={() => setCount(count + 1)}>+1</button>
      </>
    )}
  </Atom>
)
```

## Core Patterns

### Atom — read and write, `useAtom` interface

`children` receives `[value, setValue]`. For an async atom, `value` is the
awaited (resolved) value; the component suspends until the Promise resolves.

```tsx
import { Atom } from '@suspensive/jotai'
import { Suspense } from '@suspensive/react'
import { atom } from 'jotai'

const countAtom = atom(1)
const asyncDoubleCountAtom = atom(async (get) => {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return get(countAtom) * 2
})

const Example = () => (
  <Suspense fallback={'pending...'}>
    <Atom atom={asyncDoubleCountAtom}>{([count]) => <>count: {count}</>}</Atom>
  </Suspense>
)
```

### AtomValue — read-only, `useAtomValue` interface

`children` receives the value only. Use for read-only atoms (derived async
atoms are read-only, so `AtomValue` is the natural fit).

```tsx
import { AtomValue } from '@suspensive/jotai'
import { Suspense } from '@suspensive/react'
import { atom } from 'jotai'

const userAtom = atom(async () => {
  const response = await fetch('https://api.example.com/user/1')
  return (await response.json()) as { id: number; name: string }
})

const Example = () => (
  <Suspense fallback={'pending...'}>
    <AtomValue atom={userAtom}>{(user) => <div>{user.name}</div>}</AtomValue>
  </Suspense>
)
```

### SetAtom — write-only, `useSetAtom` interface

`children` receives `setValue` only, so the component does not re-render when
the atom's value changes. Writing a Promise to an atom suspends the subtree
until the Promise resolves, so async writes also need a parent Suspense.

```tsx
import { SetAtom } from '@suspensive/jotai'
import { Suspense } from '@suspensive/react'
import { atom } from 'jotai'

const request = async () => fetch('https://api.example.com/count').then((res) => res.json())
const baseAtom = atom(0)

const Example = () => (
  <Suspense fallback={'pending...'}>
    <SetAtom atom={baseAtom}>{(setValue) => <button onClick={() => setValue(request())}>request</button>}</SetAtom>
  </Suspense>
)
```

### Jotai extension atoms (jotai-tanstack-query, jotai-cache, jotai-trpc)

Atoms from Jotai extensions work as the `atom` prop without wrappers. With
`atomWithSuspenseQuery`, pair `Suspense` with `ErrorBoundary` since query
errors throw to the boundary.

```tsx
import { AtomValue } from '@suspensive/jotai'
import { ErrorBoundary, Suspense } from '@suspensive/react'
import { atomWithSuspenseQuery } from 'jotai-tanstack-query'

const userQueryAtom = atomWithSuspenseQuery(() => ({
  queryKey: ['user', 1],
  queryFn: async () => {
    const response = await fetch('https://api.example.com/user/1')
    return (await response.json()) as { id: number; name: string }
  },
}))

const MyPage = () => (
  <ErrorBoundary fallback={({ error }) => <>{error.message}</>}>
    <Suspense fallback={'pending...'}>
      <AtomValue atom={userQueryAtom}>{({ data: user }) => <div key={user.id}>{user.name}</div>}</AtomValue>
    </Suspense>
  </ErrorBoundary>
)
```

## Common Mistakes

### [HIGH] No Suspense boundary around async atom components

Wrong:

```tsx
import { AtomValue } from '@suspensive/jotai'
import { asyncUserAtom } from '~/atoms'

const Example = () => <AtomValue atom={asyncUserAtom}>{(user) => <Profile {...user} />}</AtomValue>
```

Correct:

```tsx
import { AtomValue } from '@suspensive/jotai'
import { Suspense } from '@suspensive/react'
import { asyncUserAtom } from '~/atoms'

const Example = () => (
  <Suspense fallback={<Spinner />}>
    <AtomValue atom={asyncUserAtom}>{(user) => <Profile {...user} />}</AtomValue>
  </Suspense>
)
```

Async atoms suspend; without a boundary the suspension bubbles to the nearest
ancestor Suspense or the app root fallback, blanking unrelated UI.

Source: docs/suspensive.org/src/content/en/docs/jotai/AtomValue.mdx

### [MEDIUM] Wrapper components created just to read atoms

Wrong:

```tsx
import { useAtomValue } from 'jotai'
import { cartItemAtomFamily } from '~/atoms'

const CartItemRow = ({ id }: { id: string }) => {
  const item = useAtomValue(cartItemAtomFamily(id))
  return <li>{item.name}</li>
}

const Cart = ({ ids }: { ids: string[] }) => (
  <ul>
    {ids.map((id) => (
      <CartItemRow key={id} id={id} />
    ))}
  </ul>
)
```

Correct:

```tsx
import { AtomValue } from '@suspensive/jotai'
import { cartItemAtomFamily } from '~/atoms'

const Cart = ({ ids }: { ids: string[] }) => (
  <ul>
    {ids.map((id) => (
      <AtomValue key={id} atom={cartItemAtomFamily(id)}>
        {(item) => <li>{item.name}</li>}
      </AtomValue>
    ))}
  </ul>
)
```

Hooks force extracting a child component per call site; the render-prop
components read and write atoms inline, keeping the atom usage visible where
it happens.

Source: docs/suspensive.org/src/content/en/docs/jotai/motivation.mdx

### [MEDIUM] Expecting SetAtom async writes not to suspend

Wrong:

```tsx
import { SetAtom } from '@suspensive/jotai'
import { atom } from 'jotai'

const request = async () => fetch('https://api.example.com/count').then((res) => res.json())
const baseAtom = atom(0)

const Example = () => (
  <SetAtom atom={baseAtom}>{(setValue) => <button onClick={() => setValue(request())}>request</button>}</SetAtom>
)
```

Correct:

```tsx
import { SetAtom } from '@suspensive/jotai'
import { Suspense } from '@suspensive/react'
import { atom } from 'jotai'

const request = async () => fetch('https://api.example.com/count').then((res) => res.json())
const baseAtom = atom(0)

const Example = () => (
  <Suspense fallback={'pending...'}>
    <SetAtom atom={baseAtom}>{(setValue) => <button onClick={() => setValue(request())}>request</button>}</SetAtom>
  </Suspense>
)
```

Writing a Promise to an atom triggers Suspense until it resolves, so even a
write-only `SetAtom` subtree needs a parent Suspense boundary.

Source: docs/suspensive.org/src/content/en/docs/jotai/SetAtom.mdx

## Version

Targets `@suspensive/jotai@3.21.2` with peer dependencies `jotai@^2` and
`react@^18 || ^19`.
