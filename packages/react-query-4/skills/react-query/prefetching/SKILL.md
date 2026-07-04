---
name: prefetching
description: >-
  Fire prefetches during render before Suspense boundaries with
  usePrefetchQuery/usePrefetchInfiniteQuery hooks and
  PrefetchQuery/PrefetchInfiniteQuery components. Load when avoiding request
  waterfalls, warming the cache for useSuspenseQuery/SuspenseQuery, or
  prefetching inside list rows where hooks cannot be called.
metadata:
  type: sub-skill
  library: '@suspensive/react-query-4'
  library_version: 3.21.2
  framework: react
requires: ['react-query']
sources:
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/react-query/usePrefetchQuery.mdx'
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/react-query/PrefetchQuery.mdx'
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/react-query/PrefetchInfiniteQuery.mdx'
---

This skill builds on react-query. Read ../SKILL.md first.

Prefetch APIs fire a fetch during render — before the Suspense boundary below suspends — so the suspense query inside finds warm cache instead of starting a fresh request. They return nothing, never suspend, and never throw; errors surface later through the suspense query that reads the cache.

## Setup

```bash
npm install @suspensive/react-query-4 @tanstack/react-query@4
```

`usePrefetchQuery`/`usePrefetchInfiniteQuery` and `PrefetchQuery`/`PrefetchInfiniteQuery` come from '@suspensive/react-query-4'. Use the same queryOptions object for the prefetch and the suspense query so the cache keys match.

## Core Patterns

### Prefetch before the boundary with usePrefetchQuery

```tsx
'use client'

import { Suspense } from '@suspensive/react'
import { usePrefetchQuery } from '@suspensive/react-query-4'
import { useSuspenseQuery } from '@tanstack/react-query'
import { postQueryOptions } from '~/queries'

export const PostPage = ({ postId }: { postId: number }) => {
  usePrefetchQuery(postQueryOptions(postId)) // fires during render, before the boundary

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Post postId={postId} />
    </Suspense>
  )
}

const Post = ({ postId }: { postId: number }) => {
  const { data } = useSuspenseQuery(postQueryOptions(postId))

  return (
    <article>
      <h1>{data.title}</h1>
      <p>{data.body}</p>
    </article>
  )
}
```

Without the prefetch, the request would only start when `Post` renders and suspends — one render pass later.

### Prefetch per list row with PrefetchQuery

```tsx
'use client'

import { PrefetchQuery } from '@suspensive/react-query-4'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getPostComments, getPosts } from '~/api'

export const PostsPage = () => {
  const { data: posts } = useSuspenseQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts(),
  })

  return posts.map((post) => (
    <div key={post.id}>
      {/* usePrefetchQuery cannot be called in a loop; the component form can */}
      <PrefetchQuery queryKey={['posts', post.id, 'comments']} queryFn={() => getPostComments(post.id)} />
      <h2>{post.title}</h2>
      <a href={`/posts/${post.id}/comments`}>See comments</a>
    </div>
  ))
}
```

Each row warms the comments cache while the list renders, so navigating to a comments page hits warm cache.

### Prefetching infinite queries

```tsx
'use client'

import { Suspense } from '@suspensive/react'
import { SuspenseInfiniteQuery, usePrefetchInfiniteQuery } from '@suspensive/react-query-4'
import { postsInfiniteQueryOptions } from '~/queries'

export const FeedPage = ({ userId }: { userId: number }) => {
  usePrefetchInfiniteQuery(postsInfiniteQueryOptions(userId))

  return (
    <Suspense fallback={<div>Loading feed...</div>}>
      <SuspenseInfiniteQuery {...postsInfiniteQueryOptions(userId)}>
        {({ data, fetchNextPage, hasNextPage }) => (
          <>
            {data.pages.flatMap((page) => page.posts.map((post) => <div key={post.id}>{post.title}</div>))}
            <button disabled={!hasNextPage} onClick={() => fetchNextPage()}>
              Load More
            </button>
          </>
        )}
      </SuspenseInfiniteQuery>
    </Suspense>
  )
}
```

## Common Mistakes

### [MEDIUM] Prefetching in useEffect after mount

Wrong:

```tsx
const queryClient = useQueryClient()
useEffect(() => {
  queryClient.prefetchQuery(postQueryOptions(id))
}, [id])
```

Correct:

```tsx
usePrefetchQuery(postQueryOptions(id))
```

Effects run after paint — after the child has already suspended — losing the waterfall win; usePrefetchQuery fires during render before the boundary is reached.
Source: docs/suspensive.org/src/content/en/docs/react-query/usePrefetchQuery.mdx

### [MEDIUM] Expecting data or suspension from prefetch APIs

Wrong:

```tsx
<PrefetchQuery queryKey={['posts', id]} queryFn={() => getPost(id)}>
  {({ data }) => <Post data={data} />}
</PrefetchQuery>
```

Correct:

```tsx
<PrefetchQuery queryKey={['posts', id]} queryFn={() => getPost(id)} />
<Suspense fallback={<Skeleton />}>
  <SuspenseQuery queryKey={['posts', id]} queryFn={() => getPost(id)}>
    {({ data }) => <Post data={data} />}
  </SuspenseQuery>
</Suspense>
```

Prefetch hooks and components return nothing and never suspend or throw — they only warm the cache; read the data with a suspense query.
Source: docs/suspensive.org/src/content/en/docs/react-query/PrefetchQuery.mdx

See also: ../declarative-queries/SKILL.md for the suspense queries that consume the warmed cache, ../ssr-hydration/SKILL.md for server-side prefetching with QueriesHydration instead of client render prefetch.
