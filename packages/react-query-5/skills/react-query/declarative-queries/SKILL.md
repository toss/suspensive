---
name: declarative-queries
description: >-
  SuspenseQuery, SuspenseQueries, SuspenseInfiniteQuery render-prop components
  for fetching in JSX without hook wrapper components. Load when placing
  queries at the same depth as Suspense/ErrorBoundary, running parallel
  queries, using select, integrating queryOptions/infiniteQueryOptions, or
  replacing useSuspenseQuery wrapper components.
metadata:
  type: sub-skill
  library: '@suspensive/react-query-5'
  library_version: 3.21.2
  framework: react
requires: ['react-query']
sources:
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/react-query/SuspenseQuery.mdx'
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/react-query/SuspenseQueries.mdx'
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/react-query/SuspenseInfiniteQuery.mdx'
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/react-query/motivation.mdx'
---

This skill builds on react-query. Read ../SKILL.md first.

SuspenseQuery/SuspenseQueries/SuspenseInfiniteQuery move data fetching into JSX so what suspends is visible at the same depth as the Suspense and ErrorBoundary handling it, and child components stay presentational.

## Setup

```bash
npm install @suspensive/react-query-5 @suspensive/react @tanstack/react-query@5
```

Components come from '@suspensive/react-query-5'; queryOptions/infiniteQueryOptions come from '@tanstack/react-query'.

## Core Patterns

### Parallel queries at one depth with SuspenseQuery

```tsx
'use client'

import { ErrorBoundary, Suspense } from '@suspensive/react'
import { SuspenseQuery } from '@suspensive/react-query-5'
import { PostListItem, UserProfile } from '~/components'
import { postsQueryOptions, userQueryOptions } from '~/queries'

export const PostsPage = ({ userId }: { userId: number }) => (
  <ErrorBoundary fallback={({ error }) => <>{error.message}</>}>
    <Suspense fallback={'loading...'}>
      <SuspenseQuery {...userQueryOptions(userId)}>
        {({ data: user }) => <UserProfile key={user.id} {...user} />}
      </SuspenseQuery>
      <SuspenseQuery {...postsQueryOptions(userId)} select={(posts) => posts.filter(({ isPublic }) => isPublic)}>
        {({ data: posts }) => posts.map((post) => <PostListItem key={post.id} {...post} />)}
      </SuspenseQuery>
    </Suspense>
  </ErrorBoundary>
)
```

Both queries fetch in parallel; the boundary scope is obvious because both sources of suspension sit directly under `Suspense`.

### Combined results with SuspenseQueries

```tsx
'use client'

import { ErrorBoundary, Suspense } from '@suspensive/react'
import { SuspenseQueries } from '@suspensive/react-query-5'
import { PostListItem, UserProfile } from '~/components'
import { postsQueryOptions, userQueryOptions } from '~/queries'

export const PostsPage = ({ userId }: { userId: number }) => (
  <ErrorBoundary fallback={({ error }) => <>{error.message}</>}>
    <Suspense fallback={'loading...'}>
      <SuspenseQueries queries={[userQueryOptions(userId), postsQueryOptions(userId)]}>
        {([{ data: user }, { data: posts }]) => (
          <>
            <UserProfile {...user} />
            {posts.map((post) => (
              <PostListItem key={post.id} {...post} />
            ))}
          </>
        )}
      </SuspenseQueries>
    </Suspense>
  </ErrorBoundary>
)
```

Use SuspenseQueries when one render needs both results together (useSuspenseQueries in JSX).

### Infinite scrolling with SuspenseInfiniteQuery

```tsx
'use client'

import { ErrorBoundary, Suspense } from '@suspensive/react'
import { SuspenseInfiniteQuery } from '@suspensive/react-query-5'
import { infiniteQueryOptions } from '@tanstack/react-query'
import { PostListItem } from '~/components'
import { getPosts } from '~/api'

const postsInfiniteQueryOptions = (userId: number) =>
  infiniteQueryOptions({
    queryKey: ['users', userId, 'posts'],
    queryFn: ({ pageParam }) => getPosts(userId, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
  })

export const InfinitePostsPage = ({ userId }: { userId: number }) => (
  <ErrorBoundary fallback={({ error }) => <>{error.message}</>}>
    <Suspense fallback={'loading...'}>
      <SuspenseInfiniteQuery {...postsInfiniteQueryOptions(userId)}>
        {({ data, fetchNextPage, hasNextPage }) => (
          <>
            {data.pages.flatMap((page) => page.posts.map((post) => <PostListItem key={post.id} {...post} />))}
            <button type="button" disabled={!hasNextPage} onClick={() => fetchNextPage()}>
              Load More
            </button>
          </>
        )}
      </SuspenseInfiniteQuery>
    </Suspense>
  </ErrorBoundary>
)
```

## Common Mistakes

### [MEDIUM] Wrapper components created only to call useSuspenseQuery

Wrong:

```tsx
const UserInfo = ({ userId }: { userId: number }) => {
  const { data } = useSuspenseQuery(userQueryOptions(userId))
  return <UserProfile {...data} />
}
```

Correct:

```tsx
<SuspenseQuery {...userQueryOptions(userId)}>{({ data }) => <UserProfile {...data} />}</SuspenseQuery>
```

Hooks force an extra child component under Suspense whose name hides that it suspends; SuspenseQuery keeps fetching visible in JSX so only presentational components remain.
Source: docs/suspensive.org/src/content/en/docs/react-query/motivation.mdx

### [HIGH] SuspenseQuery without an ancestor Suspense

Wrong:

```tsx
<SuspenseQuery {...postQueryOptions(id)}>{({ data }) => <Post data={data} />}</SuspenseQuery>
```

Correct:

```tsx
<Suspense fallback={<PostSkeleton />}>
  <SuspenseQuery {...postQueryOptions(id)}>{({ data }) => <Post data={data} />}</SuspenseQuery>
</Suspense>
```

The component suspends; with no boundary above it, suspension bubbles to the nearest ancestor Suspense or the app root, blanking unrelated UI.
Source: https://github.com/toss/suspensive/issues/1654

### [HIGH] Rendering SuspenseQuery in a React Server Component

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

Render-prop children are functions and cannot cross the RSC serialization boundary; keep these components inside 'use client' modules.
Source: https://github.com/toss/suspensive/issues/1563

### [HIGH] Passing enabled or placeholderData to suspense queries

Wrong:

```tsx
<SuspenseQuery queryKey={['user', userId]} queryFn={getUser} enabled={!!userId}>
  {({ data }) => <UserProfile {...data} />}
</SuspenseQuery>
```

Correct:

```tsx
{
  userId ? (
    <SuspenseQuery queryKey={['user', userId]} queryFn={() => getUser(userId)}>
      {({ data }) => <UserProfile {...data} />}
    </SuspenseQuery>
  ) : null
}
```

Suspense queries must guarantee data, so enabled/placeholderData are excluded from their option types — express conditionality with JSX instead.
Source: docs/suspensive.org/src/content/en/docs/react-query/migration (v2 breaking changes)

### [MEDIUM] Checking isLoading/isError on suspense query results

Wrong:

```tsx
<SuspenseQuery {...postsQueryOptions()}>
  {({ data, isLoading }) => (isLoading ? <Spinner /> : <List data={data} />)}
</SuspenseQuery>
```

Correct:

```tsx
<SuspenseQuery {...postsQueryOptions()}>{({ data }) => <List data={data} />}</SuspenseQuery>
```

Suspense query result types have no loading/error branches — `data` is always the success type because Suspense and ErrorBoundary guarantee it, so guards are dead code.
Source: docs/suspensive.org/src/content/en/docs/react-query/motivation.mdx

See also: ../mutations/SKILL.md for Mutation in list rows, ../prefetching/SKILL.md to warm the cache before these components suspend, ../../compositions/suspensive-react/SKILL.md for ErrorBoundary reset wiring around SuspenseQuery.
