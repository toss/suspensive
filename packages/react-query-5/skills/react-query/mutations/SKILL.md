---
name: mutations
description: >-
  Mutation render-prop component and mutationOptions for TanStack Query v5.
  Load when adding mutations inside list rows, loops, or conditionals where
  useMutation cannot be called, removing per-row wrapper components, or
  reusing mutation configs with mutationOptions.
metadata:
  type: sub-skill
  library: '@suspensive/react-query-5'
  library_version: 3.21.2
  framework: react
requires: ['react-query']
sources:
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/react-query/Mutation.mdx'
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/react-query/mutationOptions.mdx'
  - 'toss/suspensive:docs/suspensive.org/src/content/en/docs/react-query/migration/migrate-to-v3.mdx'
---

This skill builds on react-query. Read ../SKILL.md first.

`<Mutation/>` exposes a useMutation result as a render prop so each list row or conditional branch can own its mutation without extracting a wrapper component. The render prop receives the full v5 UseMutationResult (`mutate`, `mutateAsync`, `isPending`, `isError`, `error`, `data`, `reset`).

## Setup

```bash
npm install @suspensive/react-query-5 @tanstack/react-query@5
```

Import `Mutation` from '@suspensive/react-query-5'; import `mutationOptions` from '@tanstack/react-query' (official since TSQ v5; the Suspensive re-export is deprecated).

## Core Patterns

### One mutation per list row

```tsx
'use client'

import { Mutation } from '@suspensive/react-query-5'
import { useSuspenseQuery } from '@tanstack/react-query'
import { api } from '~/api'

export const PostsPage = () => {
  const { data: posts } = useSuspenseQuery({
    queryKey: ['posts'],
    queryFn: () => api.getPosts(),
  })

  return posts.map((post) => (
    <Mutation
      key={post.id}
      mutationFn={({ content }: { content: string }) =>
        api.editPost({ postId: post.id, content })
      }
    >
      {(postMutation) => (
        <div>
          {postMutation.isPending ? <Spinner /> : null}
          <div>{post.content}</div>
          <textarea
            disabled={postMutation.isPending}
            onBlur={(e) => postMutation.mutate({ content: e.target.value })}
          />
        </div>
      )}
    </Mutation>
  ))
}
```

### Reusable configs with mutationOptions

```tsx
'use client'

import { Mutation } from '@suspensive/react-query-5'
import { mutationOptions, useMutation } from '@tanstack/react-query'

const editPostMutationOptions = (postId: number) =>
  mutationOptions({
    mutationFn: (content: string) =>
      fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        body: JSON.stringify({ content }),
      }).then((res) => res.json()),
  })

// Same options work with the hook...
const useEditPost = (postId: number) => useMutation(editPostMutationOptions(postId))

// ...and spread directly into the component
export const EditPost = ({ postId }: { postId: number }) => (
  <Mutation {...editPostMutationOptions(postId)}>
    {({ mutate, isPending }) => (
      <div>
        <p>{isPending ? 'Updating...' : 'Latest updated'}</p>
        <textarea onBlur={(e) => mutate(e.target.value)} disabled={isPending} />
      </div>
    )}
  </Mutation>
)
```

### Invalidating queries on success

```tsx
'use client'

import { Mutation } from '@suspensive/react-query-5'
import { useQueryClient } from '@tanstack/react-query'
import { api } from '~/api'

export const DeletePostButton = ({ postId }: { postId: number }) => {
  const queryClient = useQueryClient()

  return (
    <Mutation
      mutationFn={() => api.deletePost(postId)}
      onSuccess={() => queryClient.invalidateQueries({ queryKey: ['posts'] })}
    >
      {({ mutate, isPending }) => (
        <button disabled={isPending} onClick={() => mutate()}>
          {isPending ? 'Deleting...' : 'Delete'}
        </button>
      )}
    </Mutation>
  )
}
```

## Common Mistakes

### [MEDIUM] Wrapper component per row just for useMutation
Wrong:
```tsx
{posts.map((post) => (
  <PostItemWithMutation key={post.id} post={post} />
))}

const PostItemWithMutation = ({ post }: { post: Post }) => {
  const deleteMutation = useMutation({ mutationFn: () => api.deletePost(post.id) })
  return (
    <button disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate()}>
      delete
    </button>
  )
}
```
Correct:
```tsx
{posts.map((post) => (
  <Mutation key={post.id} mutationFn={() => api.deletePost(post.id)}>
    {({ mutate, isPending }) => (
      <button disabled={isPending} onClick={() => mutate()}>
        delete
      </button>
    )}
  </Mutation>
))}
```
Hooks cannot be called in loops, so agents invent awkwardly named wrapper components; `<Mutation>` works inline per row with no extra depth.
Source: docs/suspensive.org/src/content/en/docs/react-query/Mutation.mdx

### [MEDIUM] Importing mutationOptions from Suspensive
Wrong:
```tsx
import { mutationOptions } from '@suspensive/react-query-5'
```
Correct:
```tsx
import { mutationOptions } from '@tanstack/react-query'
```
mutationOptions is official in TanStack Query (v5, backported to v4.44+); the Suspensive re-export exists only for compatibility and is deprecated.
Source: docs/suspensive.org/src/content/en/docs/react-query/mutationOptions.mdx

See also: ../declarative-queries/SKILL.md for the matching SuspenseQuery pattern, ../SKILL.md for which imports come from @tanstack/react-query vs Suspensive.
