---
name: react-query
description: >-
  Root skill for @suspensive/react-query-5: render-prop components for TanStack
  Query v5 Suspense — SuspenseQuery, SuspenseQueries, SuspenseInfiniteQuery,
  Mutation, PrefetchQuery, PrefetchInfiniteQuery, QueriesHydration,
  createGetQueryClient, QueryClientConsumer. Load when fetching data with
  Suspense in JSX, choosing between @suspensive/react-query-4/5, deciding
  which APIs come from @tanstack/react-query vs Suspensive, or routing to
  declarative-queries, mutations, prefetching, ssr-hydration, suspensive-react.
metadata:
  type: core
  library: '@suspensive/react-query-5'
  library_version: 3.21.2
  framework: react
---

@suspensive/react-query-5 provides render-prop components on top of @tanstack/react-query v5 so that data fetching, mutations, and prefetching can be expressed directly in JSX at the same depth as the Suspense and ErrorBoundary that handle them. Result types focus on the success case: `data` is always the resolved type, and loading/error states are delegated to boundaries. Use @suspensive/react-query-4 instead only when you must stay on @tanstack/react-query v4 (for example Safari < 15 support).

> **CRITICAL**: Import useSuspenseQuery/useSuspenseQueries/useSuspenseInfiniteQuery/queryOptions/infiniteQueryOptions/mutationOptions from @tanstack/react-query (official in v5) — NOT from @suspensive/react-query-5 (deprecated re-exports). Suspensive provides what TSQ lacks: SuspenseQuery, SuspenseQueries, SuspenseInfiniteQuery, Mutation, PrefetchQuery, QueriesHydration, createGetQueryClient.

> **CRITICAL**: All Suspensive components are client-only render-prop components — never render them in a React Server Component (build error; issue https://github.com/toss/suspensive/issues/1563). Use inside 'use client' components. The one exception is QueriesHydration, which is an async Server Component (see ssr-hydration).

> **CRITICAL**: Do not install the @suspensive/react-query facade — it is being phased out and its postinstall version switch breaks under pnpm 10+/Yarn Berry (issues #1851, #1493). Install @suspensive/react-query-5 directly with @tanstack/react-query@5.

## Sub-Skills

| Skill                                                         | Load when                                                                                                                                           |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| [declarative-queries](./declarative-queries/SKILL.md)         | Fetching with SuspenseQuery/SuspenseQueries/SuspenseInfiniteQuery in JSX, parallel queries at one depth, select, queryOptions integration           |
| [mutations](./mutations/SKILL.md)                             | Mutation component and mutationOptions; mutations inside list rows and conditionals where hooks cannot go                                           |
| [prefetching](./prefetching/SKILL.md)                         | usePrefetchQuery/usePrefetchInfiniteQuery hooks and PrefetchQuery/PrefetchInfiniteQuery components; avoiding request waterfalls                     |
| [ssr-hydration](./ssr-hydration/SKILL.md)                     | Next.js App Router setup: createGetQueryClient per-request QueryClient, QueriesHydration RSC prefetch + hydrate, skipSsrOnError, timeout, streaming |
| [suspensive-react](../compositions/suspensive-react/SKILL.md) | Composing with @suspensive/react: ErrorBoundary + useQueryErrorResetBoundary (QueryErrorBoundary replacement), shouldCatch, Delay in fallbacks      |

## Quick Decision Tree

- Need to read query data in JSX without a wrapper component → SuspenseQuery / SuspenseQueries / SuspenseInfiniteQuery → declarative-queries
- Need a mutation per list row or inside a conditional → Mutation → mutations
- Child under a Suspense boundary will fetch later; start the request now → usePrefetchQuery / PrefetchQuery → prefetching
- Next.js App Router, server prefetch, hydration, QueryClient lifecycle → createGetQueryClient + QueriesHydration → ssr-hydration
- Retry buttons, catching API errors around queries, loading UX → suspensive-react composition
- Need useSuspenseQuery, queryOptions, useQueryClient, useMutation → import from @tanstack/react-query, not Suspensive

## Minimal Working Example

```tsx
'use client'

import { ErrorBoundary, Suspense } from '@suspensive/react'
import { SuspenseQuery } from '@suspensive/react-query-5'
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
import { useSuspenseQuery, queryOptions } from '@suspensive/react-query-5'
```

Correct:

```tsx
import { useSuspenseQuery, queryOptions } from '@tanstack/react-query'
import { SuspenseQuery, Mutation, QueriesHydration } from '@suspensive/react-query-5'
```

useSuspenseQuery/useSuspenseQueries/useSuspenseInfiniteQuery/queryOptions/infiniteQueryOptions/mutationOptions are official in TSQ v5 and the Suspensive re-exports are deprecated — import only the components TSQ lacks from Suspensive.
Source: docs/suspensive.org/src/content/en/docs/react-query/useSuspenseQuery.mdx

### [HIGH] Installing the @suspensive/react-query facade package

Wrong:

```bash
npm install @suspensive/react-query
```

Correct:

```bash
npm install @suspensive/react-query-5 @tanstack/react-query@5
```

The facade's postinstall version switch is blocked by pnpm 10+ and Yarn Berry, so its exports default to v4 and break v5 builds; it is being phased out — install the versioned package matching your @tanstack/react-query major.
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

Since v3, networkMode is fixed to 'always' for suspense hooks and components (Chromium's navigator.onLine is unreliable and a paused fetchStatus deadlocks Suspense), so a user-supplied networkMode is ignored — remove it (codemod: `npx @suspensive/codemods remove-networkmode .`).
Source: docs/suspensive.org/src/content/en/docs/react-query/migration/migrate-to-v3.mdx

### [HIGH] Rendering Suspensive components in a Server Component

Wrong:

```tsx
// app/page.tsx — Server Component
import { SuspenseQuery } from '@suspensive/react-query-5'

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

import { SuspenseQuery } from '@suspensive/react-query-5'

export const Posts = () => (
  <SuspenseQuery queryKey={['posts']} queryFn={getPosts}>
    {({ data }) => <PostList posts={data} />}
  </SuspenseQuery>
)
```

Render-prop children are functions, which cannot cross the RSC serialization boundary, so using these components in a Server Component fails the build.
Source: https://github.com/toss/suspensive/issues/1563

## Version

Targets @suspensive/react-query-5 v3.21.2 with @tanstack/react-query v5.
