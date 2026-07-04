---
name: react-query
description: >-
  Root skill for @suspensive/react-query-4: render-prop components for TanStack
  Query v4 Suspense — SuspenseQuery, SuspenseQueries, SuspenseInfiniteQuery,
  Mutation, PrefetchQuery, PrefetchInfiniteQuery, QueriesHydration,
  createGetQueryClient, QueryClientConsumer. Load when fetching data with
  Suspense in JSX on TanStack Query v4, choosing between
  @suspensive/react-query-4/5, deciding which APIs come from
  @tanstack/react-query vs Suspensive, or routing to declarative-queries,
  mutations, prefetching, ssr-hydration, suspensive-react.
metadata:
  type: core
  library: '@suspensive/react-query-4'
  library_version: 3.21.2
  framework: react
---

@suspensive/react-query-4 provides render-prop components on top of @tanstack/react-query v4 so that data fetching, mutations, and prefetching can be expressed directly in JSX at the same depth as the Suspense and ErrorBoundary that handle them. Result types focus on the success case: `data` is always the resolved type, and loading/error states are delegated to boundaries. This package exists for apps that must support older browsers: TanStack Query v5 requires ES2020 class private fields (Safari 15+), so @suspensive/react-query-4 delivers the same v5-style interface on top of TSQ v4. If you can run TSQ v5, use @suspensive/react-query-5 instead.

> **CRITICAL**: Import useSuspenseQuery/useSuspenseQueries/useSuspenseInfiniteQuery/queryOptions/infiniteQueryOptions/mutationOptions from @tanstack/react-query — NOT from @suspensive/react-query-4 (deprecated re-exports). These were backported to TSQ v4: useSuspenseQuery/useSuspenseQueries/useSuspenseInfiniteQuery/queryOptions in 4.40+, infiniteQueryOptions in 4.41+, mutationOptions in 4.44+ — and this package's peer requires @tanstack/react-query ^4.44.0, so all are available. Suspensive provides what TSQ lacks: SuspenseQuery, SuspenseQueries, SuspenseInfiniteQuery, Mutation, PrefetchQuery, QueriesHydration, createGetQueryClient.

> **CRITICAL**: All Suspensive components are client-only render-prop components — never render them in a React Server Component (build error; issue https://github.com/toss/suspensive/issues/1563). Use inside 'use client' components. The one exception is QueriesHydration, which is an async Server Component (see ssr-hydration).

> **CRITICAL**: Do not install the @suspensive/react-query facade — it is being phased out and its postinstall version switch breaks under pnpm 10+/Yarn Berry (issues #1851, #1493). Install @suspensive/react-query-4 directly with @tanstack/react-query@4.

## Sub-Skills

| Skill                                                         | Load when                                                                                                                                                                |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [declarative-queries](./declarative-queries/SKILL.md)         | Fetching with SuspenseQuery/SuspenseQueries/SuspenseInfiniteQuery in JSX, parallel queries at one depth, select, queryOptions integration                                |
| [mutations](./mutations/SKILL.md)                             | Mutation component and mutationOptions; mutations inside list rows and conditionals where hooks cannot go                                                                |
| [prefetching](./prefetching/SKILL.md)                         | usePrefetchQuery/usePrefetchInfiniteQuery hooks and PrefetchQuery/PrefetchInfiniteQuery components; avoiding request waterfalls                                          |
| [ssr-hydration](./ssr-hydration/SKILL.md)                     | Next.js App Router setup: createGetQueryClient per-request QueryClient, QueriesHydration RSC prefetch + hydrate, skipSsrOnError, timeout, streaming, QueryClientConsumer |
| [suspensive-react](../compositions/suspensive-react/SKILL.md) | Composing with @suspensive/react: ErrorBoundary + useQueryErrorResetBoundary (QueryErrorBoundary replacement), shouldCatch, Delay in fallbacks                           |

## Quick Decision Tree

- Need to read query data in JSX without a wrapper component → SuspenseQuery / SuspenseQueries / SuspenseInfiniteQuery → declarative-queries
- Need a mutation per list row or inside a conditional → Mutation → mutations
- Child under a Suspense boundary will fetch later; start the request now → usePrefetchQuery / PrefetchQuery → prefetching
- Next.js App Router, server prefetch, hydration, QueryClient lifecycle → createGetQueryClient + QueriesHydration → ssr-hydration
- Retry buttons, catching API errors around queries, loading UX → suspensive-react composition
- Need useSuspenseQuery, queryOptions, useQueryClient, useMutation → import from @tanstack/react-query, not Suspensive
- Can drop old-browser support and move to TSQ v5 → migrate to @suspensive/react-query-5

## Minimal Working Example

```tsx
'use client'

import { ErrorBoundary, Suspense } from '@suspensive/react'
import { SuspenseQuery } from '@suspensive/react-query-4'
import { queryOptions } from '@tanstack/react-query'

type Post = { id: number; title: string; body: string }

const postQueryOptions = (postId: number) =>
  queryOptions({
    queryKey: ['posts', postId],
    queryFn: async (): Promise<Post> => {
      const response = await fetch(`/api/posts/${postId}`)
      if (!response.ok) throw new Error('Failed to fetch post')
      return response.json()
    },
  })

export const PostPage = ({ postId }: { postId: number }) => (
  <ErrorBoundary
    fallback={({ error, reset }) => (
      <div>
        <p>{error.message}</p>
        <button onClick={reset}>retry</button>
      </div>
    )}
  >
    <Suspense fallback={<div>Loading post...</div>}>
      <SuspenseQuery {...postQueryOptions(postId)}>
        {({ data: post }) => (
          <article>
            <h1>{post.title}</h1>
            <p>{post.body}</p>
          </article>
        )}
      </SuspenseQuery>
    </Suspense>
  </ErrorBoundary>
)
```

## Common Mistakes

### [HIGH] Importing backported hooks from Suspensive package

Wrong:

```tsx
import { useSuspenseQuery, queryOptions } from '@suspensive/react-query-4'
```

Correct:

```tsx
import { useSuspenseQuery, queryOptions } from '@tanstack/react-query'
import { SuspenseQuery, Mutation, QueriesHydration } from '@suspensive/react-query-4'
```

useSuspenseQuery/useSuspenseQueries/useSuspenseInfiniteQuery/queryOptions are official in @tanstack/react-query 4.40+, infiniteQueryOptions in 4.41+, mutationOptions in 4.44+ — the package's peer range (^4.44.0) guarantees all of them, and the Suspensive re-exports are deprecated. Import only the components TSQ lacks from Suspensive.
Source: docs/suspensive.org/src/content/en/docs/react-query/useSuspenseQuery.mdx

### [HIGH] Installing the @suspensive/react-query facade package

Wrong:

```bash
npm install @suspensive/react-query
```

Correct:

```bash
npm install @suspensive/react-query-4 @tanstack/react-query@4
```

The facade's postinstall version switch is blocked by pnpm 10+ and Yarn Berry, so its exports can silently mismatch your installed @tanstack/react-query major; it is being phased out — install the versioned package matching your @tanstack/react-query major.
Source: https://github.com/toss/suspensive/issues/1851, https://github.com/toss/suspensive/issues/1493

### [MEDIUM] Setting networkMode on suspense queries

Wrong:

```tsx
useSuspenseQuery({ queryKey: ['posts'], queryFn: getPosts, networkMode: 'online' })
```

Correct:

```tsx
useSuspenseQuery({ queryKey: ['posts'], queryFn: getPosts })
```

Since v3, networkMode is fixed to 'always' for suspense hooks and components (Chromium's navigator.onLine is unreliable and a paused fetchStatus deadlocks Suspense), so a user-supplied networkMode is ignored — remove it (codemod: `npx @suspensive/codemods remove-networkmode .`). Note that on TSQ v4 this DIVERGES from vanilla @tanstack/react-query v4, whose own default is 'online': Suspensive suspense queries fetch even while the browser reports offline, unlike plain v4 useQuery (issues #1442, #1459).
Source: docs/suspensive.org/src/content/en/docs/react-query/migration/migrate-to-v3.mdx

### [HIGH] Rendering Suspensive components in a Server Component

Wrong:

```tsx
// app/page.tsx — Server Component
import { SuspenseQuery } from '@suspensive/react-query-4'

export default function Page() {
  return (
    <SuspenseQuery queryKey={['posts']} queryFn={getPosts}>
      {({ data }) => <PostList posts={data} />}
    </SuspenseQuery>
  )
}
```

Correct:

```tsx
'use client'

import { SuspenseQuery } from '@suspensive/react-query-4'

export const Posts = () => (
  <SuspenseQuery queryKey={['posts']} queryFn={getPosts}>
    {({ data }) => <PostList posts={data} />}
  </SuspenseQuery>
)
```

Render-prop children are functions, which cannot cross the RSC serialization boundary, so using these components in a Server Component fails the build.
Source: https://github.com/toss/suspensive/issues/1563

## Version

Targets @suspensive/react-query-4 v3.21.2 with @tanstack/react-query v4 (^4.44.0).
