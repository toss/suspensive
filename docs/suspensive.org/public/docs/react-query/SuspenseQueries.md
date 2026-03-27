---
url: /docs/react-query/SuspenseQueries
---

# SuspenseQueries

Just as [`<SuspenseQuery/>`](/docs/react-query/SuspenseQuery) makes useSuspenseQuery easier to use in jsx, `<SuspenseQueries/>` serves to make useSuspenseQueries easier to use in jsx.

```jsx /SuspenseQueries/
import { SuspenseQueries } from '@suspensive/react-query'
import { Suspense, ErrorBoundary } from '@suspensive/react'
import { PostListItem, UserProfile } from '~/components'

const PostsPage = ({ userId }) => (
  <ErrorBoundary fallback={({ error }) => <>{error.message}</>}>
    <Suspense fallback="loading...">
      <SuspenseQueries
        queries={[userQueryOptions(userId), postsQueryOptions(userId)]}
      >
        {([{ data: user }, { data: posts }]) => (
          <>
            {<UserProfile {...user} />}
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

### Version History

| Version  | Changes                                                                                                                                   |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `v3.0.0` | `networkMode` has been fixed to `'always'`. For more details, please refer to the [Migration to v3 guide](./migration/migrate-to-v3.mdx). |
