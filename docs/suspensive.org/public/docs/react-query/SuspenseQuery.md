---
url: /docs/react-query/SuspenseQuery
---

# SuspenseQuery

We provide these components to clearly express what causes suspense at the same depth.

1. Prop-drilling resulting from removing depth such as UserInfo and PostList for data-fetching only is also removed.
2. Changing the range of Suspense and ErrorBoundary becomes simple. Parallel processing of queries is also easier.
3. Because it manages all data-fetching within the Page component, the internal components are presentational, so it is easy to separate the components.

```jsx /SuspenseQuery/
import { SuspenseQuery } from '@suspensive/react-query'
import { Suspense, ErrorBoundary } from '@suspensive/react'
import { PostListItem, UserProfile } from '~/components'

const PostsPage = ({ userId }) => (
  <ErrorBoundary fallback={({ error }) => <>{error.message}</>}>
    <Suspense fallback={'loading...'}>
      <SuspenseQuery {...userQueryOptions(userId)}>
        {({ data: user }) => <UserProfile key={user.id} {...user} />}
      </SuspenseQuery>
      <SuspenseQuery
        {...postsQueryOptions(userId)}
        select={(posts) => posts.filter(({ isPublic }) => isPublic)}
      >
        {({ data: posts }) =>
          posts.map((post) => <PostListItem key={post.id} {...post} />)
        }
      </SuspenseQuery>
    </Suspense>
  </ErrorBoundary>
)
```

## Motivation: useSuspenseQuery is not obvious

Because the existing useSuspenseQuery is a hook, it creates components with names such as UserInfo and PostList to place Suspense and ErrorBoundary on the parent.
This makes it difficult to predict what suspense and errors will be thrown inside UserInfo and PostList.

```jsx
// posts/page.tsx
import { Suspense, ErrorBoundary } from '@suspensive/react'
import { UserInfo } from './components/UserInfo'
import { PostList } from './components/PostList'

const PostsPage = ({ userId }) => (
  <ErrorBoundary fallback={({ error }) => <>{error.message}</>}>
    <Suspense fallback={'loading...'}>
      <UserInfo userId={userId} />
      {/* It is difficult to predict whether a suspension will occur internally. */}
      <PostList userId={userId} />
      {/* It is difficult to predict whether a suspension will occur internally. */}
    </Suspense>
  </ErrorBoundary>
)
```

```jsx /useSuspenseQuery/
// posts/components/UserInfo.tsx
import { useSuspenseQuery } from '@suspensive/react-query'
import { UserProfile } from '~/components'

// From the perspective of using this component, it is impossible to predict whether Suspense will occur internally just by the name UserInfo.
const UserInfo = ({ userId }) => {
  // We need to create this component just for data-fetching.
  const { data: user } = useSuspenseQuery(userQueryOptions(userId))

  return <UserProfile {...user} />
}
```

```jsx /useSuspenseQuery/
// posts/components/PostList.tsx
import { useSuspenseQuery } from '@suspensive/react-query'
import { PostListItem } from '~/components'

// From the perspective of using this component, it is impossible to predict whether a suspense will occur internally based on the name PostList alone.
const PostList = ({ userId }) => {
  // We need to create this component just for data-fetching.
  const { data: posts } = useSuspenseQuery({
    ...postsQueryOptions(userId),
    select: (posts) => posts.filter(({ isPublic }) => isPublic),
  })

  return (
    <>
      {posts.map((post) => (
        <PostListItem {...post} />
      ))}
    </>
  )
}
```

### Version History

| Version  | Changes                                                                                                                                   |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `v3.0.0` | `networkMode` has been fixed to `'always'`. For more details, please refer to the [Migration to v3 guide](./migration/migrate-to-v3.mdx). |
