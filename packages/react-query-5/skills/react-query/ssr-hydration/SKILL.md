---
name: ssr-hydration
description: >-
  Server rendering and hydration for TanStack Query v5 in RSC frameworks:
  request-scoped QueryClient with createGetQueryClient, server prefetch +
  dehydrate + hydrate with QueriesHydration, skipSsrOnError, timeout,
  per-boundary HTML streaming. Load when setting up QueryClient in Next.js
  App Router, prefetching queries in Server Components, or debugging
  cross-request cache leaks and hydration issues.
metadata:
  type: sub-skill
  library: '@suspensive/react-query-5'
  library_version: 3.21.2
  framework: react
requires: ['react-query']
sources:
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/react-query/createGetQueryClient.mdx'
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/react-query/QueriesHydration.mdx'
---

This skill builds on react-query. Read ../SKILL.md first.

Two experimental APIs cover queries in SSR: `createGetQueryClient` manages the QueryClient lifecycle (new instance per server request, singleton in the browser), and `QueriesHydration` — an async Server Component — prefetches an array of queries on the server and hydrates them into client components, replacing manual QueryClient + prefetchQuery + dehydrate + HydrationBoundary boilerplate. Both interfaces are experimental and may change.

On the server, `getQueryClient` forces the cache removal time (`gcTime` in v5) to `Infinity` — automatic and non-overridable — so caches survive until the request completes and no `setTimeout` GC scheduling piles up under concurrent requests. The browser instance uses your configured value.

## Setup

```tsx
// app/get-query-client.ts
import { createGetQueryClient } from '@suspensive/react-query-5'

export const { getQueryClient } = createGetQueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
})
```

```tsx
// app/providers.tsx
'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { getQueryClient } from './get-query-client'
import type { ReactNode } from 'react'

export const Providers = ({ children }: { children: ReactNode }) => {
  const queryClient = getQueryClient()

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
```

```tsx
// app/layout.tsx
import { Providers } from './providers'
import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

## Core Patterns

### Per-boundary streaming with QueriesHydration

QueriesHydration is an async RSC — render it in a Server Component only. Give each section its own Suspense + QueriesHydration so each streams independently as its queries resolve.

```tsx
// app/posts/page.tsx — Server Component (no 'use client')
import { Suspense } from '@suspensive/react'
import { QueriesHydration } from '@suspensive/react-query-5'
import { postsQueryOptions, userQueryOptions } from './queries'
import { PostList, UserProfile } from './_components'

export default function PostsPage({ userId }: { userId: number }) {
  return (
    <>
      <Suspense fallback={<div>Loading user...</div>}>
        <QueriesHydration queries={[userQueryOptions(userId)]}>
          <UserProfile userId={userId} />
        </QueriesHydration>
      </Suspense>
      <Suspense fallback={<div>Loading posts...</div>}>
        <QueriesHydration queries={[postsQueryOptions(userId)]}>
          <PostList userId={userId} />
        </QueriesHydration>
      </Suspense>
    </>
  )
}
```

```tsx
// app/posts/_components/UserProfile.tsx
'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { userQueryOptions } from '../queries'

export const UserProfile = ({ userId }: { userId: number }) => {
  // Data prefetched on the server is hydrated — no client refetch
  const { data: user } = useSuspenseQuery(userQueryOptions(userId))

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

`queries` accepts a mix of `queryOptions` and `infiniteQueryOptions` results; every entry must have a `queryKey`. All queries in one array are fetched in parallel with `Promise.all`.

### skipSsrOnError: let the browser take over when server fetch fails

Fetching happens at up to 3 stages: (1) RSC in QueriesHydration, (2) RCC on the server via useSuspenseQuery, (3) RCC in the browser. If stage 1 fails (for example cookies/auth unavailable on the server), stage 2 usually fails identically — but the browser can succeed.

- `true` (default): on stage-1 error, skip SSR and fetch in the browser
- `{ fallback: ReactNode }`: same, but render a custom fallback until the browser takes over
- `false`: proceed to stage 2 without hydration (retry the fetch during server rendering of the client component)

```tsx
import { Suspense } from '@suspensive/react'
import { QueriesHydration } from '@suspensive/react-query-5'
import { postsQueryOptions, userQueryOptions } from './queries'
import { PostList, UserProfile } from './_components'

export default function Page({ userId }: { userId: number }) {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <QueriesHydration queries={[userQueryOptions(userId)]}>
          <UserProfile userId={userId} />
        </QueriesHydration>
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <QueriesHydration
          queries={[postsQueryOptions(userId)]}
          skipSsrOnError={{ fallback: <div>Unable to fetch on server...</div> }}
        >
          <PostList userId={userId} />
        </QueriesHydration>
      </Suspense>
    </>
  )
}
```

### timeout: bound server fetch time

```tsx
<Suspense fallback={<div>Loading...</div>}>
  <QueriesHydration queries={[userQueryOptions(userId)]} timeout={1000}>
    <UserProfile userId={userId} />
  </QueriesHydration>
</Suspense>
```

If the queries exceed `timeout` ms on the server, an error is thrown; combined with skipSsrOnError `true`/`{ fallback }`, the server gives up and the browser renders instead. No timeout applies when unset.

### Dependent queries sharing one queryClient

```tsx
import { QueryClient } from '@tanstack/react-query'
import { Suspense } from '@suspensive/react'
import { QueriesHydration } from '@suspensive/react-query-5'
import { productQueryOptions, relatedProductsQueryOptions } from './queries'
import { ProductInfo, RelatedProducts } from './_components'

export default async function ProductPage({ productId }: { productId: string }) {
  const queryClient = new QueryClient() // created inside the request — never module-level

  const product = await queryClient.ensureQueryData(productQueryOptions(productId))

  return (
    <>
      <Suspense fallback={<div>Loading product...</div>}>
        <QueriesHydration queryClient={queryClient} queries={[productQueryOptions(productId)]}>
          <ProductInfo productId={productId} />
        </QueriesHydration>
      </Suspense>
      <Suspense fallback={<div>Loading related...</div>}>
        <QueriesHydration
          queryClient={queryClient}
          queries={[relatedProductsQueryOptions(product.categoryId)]}
        >
          <RelatedProducts categoryId={product.categoryId} />
        </QueriesHydration>
      </Suspense>
    </>
  )
}
```

## Common Mistakes

### [CRITICAL] Module-level global QueryClient on the server
Wrong:
```tsx
// query-client.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient() // shared across all requests
```
Correct:
```tsx
// get-query-client.ts
import { createGetQueryClient } from '@suspensive/react-query-5'

export const { getQueryClient } = createGetQueryClient()
// call getQueryClient() where needed; never store the result in a global
```
A module-level QueryClient is shared across server requests, leaking one user's cached data (auth tokens, personal data) into another user's response — createGetQueryClient returns a new instance per server request and a singleton only in the browser.
Source: docs/suspensive.org/src/content/en/docs/react-query/createGetQueryClient.mdx

### [CRITICAL] Storing getQueryClient() result in a module global
Wrong:
```tsx
import { getQueryClient } from './get-query-client'

export const queryClient = getQueryClient() // reintroduces cross-request sharing
```
Correct:
```tsx
import { getQueryClient } from './get-query-client'

const Component = () => {
  const queryClient = getQueryClient()
  return null
}
```
Exporting the call result freezes one instance at module-evaluation time and shares it across requests — exactly the leak the factory exists to prevent; call getQueryClient() at each use site.
Source: docs/suspensive.org/src/content/en/docs/react-query/createGetQueryClient.mdx

### [HIGH] Passing config to getQueryClient instead of createGetQueryClient
Wrong:
```tsx
const queryClient = getQueryClient({
  defaultOptions: { queries: { staleTime: 60_000 } },
})
```
Correct:
```tsx
export const { getQueryClient } = createGetQueryClient({
  defaultOptions: { queries: { staleTime: 60_000 } },
})
```
getQueryClient takes no arguments — the browser singleton must be config-stable across calls — so defaults belong on createGetQueryClient(config).
Source: docs/suspensive.org/src/content/en/docs/react-query/createGetQueryClient.mdx

### [HIGH] Using QueriesHydration outside an async RSC
Wrong:
```tsx
'use client'

import { QueriesHydration } from '@suspensive/react-query-5'

export const Posts = ({ userId }: { userId: number }) => (
  <QueriesHydration queries={[postsQueryOptions(userId)]}>
    <PostList userId={userId} />
  </QueriesHydration>
)
```
Correct:
```tsx
// app/posts/page.tsx — Server Component
import { QueriesHydration } from '@suspensive/react-query-5'

export default function PostsPage({ userId }: { userId: number }) {
  return (
    <QueriesHydration queries={[postsQueryOptions(userId)]}>
      <PostList userId={userId} />
    </QueriesHydration>
  )
}
```
QueriesHydration is an async Server Component; it only works in RSC frameworks (Next.js 13+ App Router) and cannot render in client components or the pages router.
Source: docs/suspensive.org/src/content/en/docs/react-query/QueriesHydration.mdx

### [MEDIUM] Manual prefetch/dehydrate boilerplate in every RSC
Wrong:
```tsx
const queryClient = new QueryClient()
await queryClient.prefetchQuery(postQueryOptions(id))
await queryClient.prefetchQuery(commentsQueryOptions(id))
return (
  <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
)
```
Correct:
```tsx
<QueriesHydration queries={[postQueryOptions(id), commentsQueryOptions(id)]}>
  {children}
</QueriesHydration>
```
QueriesHydration automates client creation, parallel prefetch, dehydrate, and hydration in one component, mixes regular and infinite queries, and adds skipSsrOnError/timeout for free.
Source: docs/suspensive.org/src/content/en/docs/react-query/QueriesHydration.mdx

## Tensions

### HIGH Tension: getting-started simplicity vs server security
A module-level `new QueryClient()` is the simplest setup and perfectly correct in a pure SPA — but copied into an SSR app it becomes a cross-request data leak. When code moves from CSR to Next.js App Router, converting the global client to `createGetQueryClient` is mandatory, not optional cleanup. Never silence this by "it works in dev" — the leak only manifests under concurrent production requests.

### HIGH Tension: clientOnly simplicity vs SSR value
Skipping SSR with `<Suspense clientOnly>` (see @suspensive/react's skills/react/ssr-client-only skill) is the easiest fix for hydration problems, but it discards streaming SSR and server prefetch that QueriesHydration exists to provide. Conversely, do not build a QueriesHydration pipeline for a widget that should simply be client-only: a clientOnly boundary removes the need for QueriesHydration under it, because no server prefetch happens there.

```tsx
// Server Component: one section client-only, one server-prefetched
<Suspense clientOnly fallback={<div>Loading user...</div>}>
  <UserProfile userId={userId} />
</Suspense>
<Suspense fallback={<div>Loading posts...</div>}>
  <QueriesHydration queries={[postsQueryOptions(userId)]}>
    <PostList userId={userId} />
  </QueriesHydration>
</Suspense>
```

See also: ../prefetching/SKILL.md for client-render prefetching, ../declarative-queries/SKILL.md for the client components consuming hydrated data, @suspensive/react skills/react/ssr-client-only for clientOnly and ClientOnly/useIsClient.
