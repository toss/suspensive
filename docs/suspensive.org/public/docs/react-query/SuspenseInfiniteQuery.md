---
url: /docs/react-query/SuspenseInfiniteQuery
---

# SuspenseInfiniteQuery

Just as [`<SuspenseQuery/>`](/docs/react-query/SuspenseQuery) makes useSuspenseQuery easier to use in jsx, `<SuspenseInfiniteQuery/>` serves to make useSuspenseInfiniteQuery easier to use in jsx.

```jsx /SuspenseInfiniteQuery/
import { SuspenseInfiniteQuery } from '@suspensive/react-query'
import { Suspense, ErrorBoundary } from '@suspensive/react'
import { PostListItem } from '~/components'

const InfinitePostsPage = ({ userId }) => (
  <ErrorBoundary fallback={({ error }) => <>{error.message}</>}>
    <Suspense fallback="loading...">
      <SuspenseInfiniteQuery {...postsInfiniteQueryOptions(userId)}>
        {({ data, fetchNextPage }) => (
          <>
            {data.pages.map((post) => (
              <PostListItem {...post} />
            ))}
            <button
              type="button"
              onClick={() => {
                fetchNextPage()
              }}
            >
              Load More
            </button>
          </>
        )}
      </SuspenseInfiniteQuery>
    </Suspense>
  </ErrorBoundary>
)
```

### Version History

| Version  | Changes                                                                                                                                   |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `v3.0.0` | `networkMode` has been fixed to `'always'`. For more details, please refer to the [Migration to v3 guide](./migration/migrate-to-v3.mdx). |
