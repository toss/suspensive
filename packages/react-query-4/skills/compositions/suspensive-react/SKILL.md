---
name: suspensive-react
description: >-
  Composition seam between @suspensive/react-query-4 and @suspensive/react:
  replacing removed QueryErrorBoundary with ErrorBoundary +
  useQueryErrorResetBoundary, resetting query errors so retries actually
  refetch, shouldCatch with API error classes around SuspenseQuery, Delay
  inside Suspense fallbacks. Load when wiring retry buttons for query errors
  or layering error boundaries around suspense queries.
metadata:
  type: composition
  library: '@suspensive/react-query-4'
  library_version: 3.21.2
  framework: react
requires: ['react-query']
sources:
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/react-query/migration/migrate-to-v3.mdx'
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/react/ErrorBoundary.mdx'
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/react/Delay.mdx'
---

This skill builds on react-query. Read ../../react-query/SKILL.md first.

This skill covers only the seam between @suspensive/react-query-4 and @suspensive/react: error boundaries around suspense queries, query error resetting, and loading UX in fallbacks. The key fact: `QueryErrorBoundary` was removed in v3 (it forced a peerDependency on @suspensive/react; issues #1424, #1325, #1349) — you compose the replacement yourself from `ErrorBoundary` and TanStack Query's `useQueryErrorResetBoundary` (same import on TSQ v4 as v5).

## Setup

```bash
npm install @suspensive/react-query-4 @suspensive/react @tanstack/react-query@4
```

## Core Patterns

### QueryErrorBoundary replacement (complete wiring)

Resetting the boundary alone is not enough: the query error is still cached, so remounting the children immediately rethrows it. Wire `useQueryErrorResetBoundary().reset` into `onReset` so both the boundary and the query error cache reset together, and expose the boundary's own `reset` in the fallback as the retry button.

```tsx
'use client'

import { ErrorBoundary } from '@suspensive/react'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from 'react'

export const QueryErrorBoundary = forwardRef<
  ComponentRef<typeof ErrorBoundary>,
  ComponentPropsWithoutRef<typeof ErrorBoundary>
>(({ onReset, ...props }, resetRef) => {
  const { reset } = useQueryErrorResetBoundary()
  return (
    <ErrorBoundary
      {...props}
      onReset={() => {
        onReset?.()
        reset()
      }}
      ref={resetRef}
    />
  )
})
```

```tsx
'use client'

import { Suspense } from '@suspensive/react'
import { SuspenseQuery } from '@suspensive/react-query-4'
import { QueryErrorBoundary } from '~/components/QueryErrorBoundary'
import { postsQueryOptions } from '~/queries'

export const PostsSection = () => (
  <QueryErrorBoundary
    fallback={({ error, reset }) => (
      <div>
        <p>{error.message}</p>
        <button onClick={reset}>retry</button>
      </div>
    )}
  >
    <Suspense fallback={<div>Loading posts...</div>}>
      <SuspenseQuery {...postsQueryOptions()}>
        {({ data: posts }) => posts.map((post) => <div key={post.id}>{post.title}</div>)}
      </SuspenseQuery>
    </Suspense>
  </QueryErrorBoundary>
)
```

Clicking retry calls the fallback's `reset`, which triggers `onReset`, which resets TanStack Query's error boundary state — so the remounted SuspenseQuery refetches instead of rethrowing the cached error.

### shouldCatch: catch only API errors around SuspenseQuery

```tsx
'use client'

import { ErrorBoundary, Suspense } from '@suspensive/react'
import { SuspenseQuery } from '@suspensive/react-query-4'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { userQueryOptions } from '~/queries'

class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
  }
}

export const UserSection = ({ userId }: { userId: number }) => {
  const { reset } = useQueryErrorResetBoundary()

  return (
    <ErrorBoundary
      shouldCatch={ApiError}
      onReset={reset}
      fallback={({ error, reset: retry }) => (
        <div>
          <p>API failed: {error.message}</p>
          <button onClick={retry}>retry</button>
        </div>
      )}
    >
      <Suspense fallback={<div>Loading user...</div>}>
        <SuspenseQuery {...userQueryOptions(userId)}>{({ data: user }) => <h1>{user.name}</h1>}</SuspenseQuery>
      </Suspense>
    </ErrorBoundary>
  )
}
```

Non-ApiError throws (render bugs) propagate past this boundary to an outer one, keeping API retry UI separate from crash UI. Make the queryFn throw typed errors (`throw new ApiError(response.status, ...)`) for this to filter correctly.

### Delay inside the Suspense fallback

```tsx
'use client'

import { Delay, Suspense } from '@suspensive/react'
import { SuspenseQuery } from '@suspensive/react-query-4'
import { postsQueryOptions } from '~/queries'

export const PostList = () => (
  <Suspense
    fallback={
      <Delay ms={200}>
        <div>Loading posts...</div>
      </Delay>
    }
  >
    <SuspenseQuery {...postsQueryOptions()}>
      {({ data: posts }) => posts.map((post) => <div key={post.id}>{post.title}</div>)}
    </SuspenseQuery>
  </Suspense>
)
```

Fast cache hits (under 200ms) show nothing instead of a spinner flash. Delay never extends how long the fallback stays visible — it only postpones exposing it.

## Common Mistakes

### [HIGH] Importing removed QueryErrorBoundary from Suspensive

Wrong:

```tsx
import { QueryErrorBoundary } from '@suspensive/react-query-4'

const Example = () => (
  <QueryErrorBoundary>
    <PostsSection />
  </QueryErrorBoundary>
)
```

Correct:

```tsx
import { ErrorBoundary } from '@suspensive/react'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'

const Example = () => {
  const { reset } = useQueryErrorResetBoundary()
  return (
    <ErrorBoundary
      onReset={reset}
      fallback={({ error, reset: retry }) => <button onClick={retry}>{error.message} — retry</button>}
    >
      <PostsSection />
    </ErrorBoundary>
  )
}
```

QueryErrorBoundary forced a peerDependency on @suspensive/react for a trivial implementation, so v3 removed it in favor of composing ErrorBoundary with useQueryErrorResetBoundary. Removed in v3, but agents trained on older code still generate this.
Source: docs/suspensive.org/src/content/en/docs/react-query/migration/migrate-to-v3.mdx (#1424)

### [HIGH] Retry button resets boundary but not query error

Wrong:

```tsx
<ErrorBoundary fallback={({ error, reset }) => <button onClick={reset}>{error.message} — retry</button>}>
  <Suspense fallback={<Spinner />}>
    <SuspenseQuery {...postsQueryOptions()}>{({ data }) => <List data={data} />}</SuspenseQuery>
  </Suspense>
</ErrorBoundary>
```

Correct:

```tsx
const { reset } = useQueryErrorResetBoundary()

<ErrorBoundary
  onReset={reset}
  fallback={({ error, reset: retry }) => (
    <button onClick={retry}>{error.message} — retry</button>
  )}
>
  <Suspense fallback={<Spinner />}>
    <SuspenseQuery {...postsQueryOptions()}>
      {({ data }) => <List data={data} />}
    </SuspenseQuery>
  </Suspense>
</ErrorBoundary>
```

Boundary reset only remounts the children; the query error is still in TanStack Query's cache, so the remounted suspense query rethrows it instantly and never refetches — resetting both is required.
Source: https://github.com/toss/suspensive/issues/91

See also: ../../react-query/declarative-queries/SKILL.md for SuspenseQuery itself, ../../react-query/mutations/SKILL.md for v4 mutation result naming (isLoading, not isPending), @suspensive/react skills/react/error-handling for shouldCatch/resetKeys/ErrorBoundaryGroup, @suspensive/react skills/react/loading-ux for Delay and isDelayed fades.
