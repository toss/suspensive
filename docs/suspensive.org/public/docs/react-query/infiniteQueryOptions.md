---
url: /docs/react-query/infiniteQueryOptions
---

# infiniteQueryOptions

> **Warning:** **Deprecated in @suspensive/react-query**
> 
> This interface is now officially supported in TanStack Query v4.41.0+. Since TanStack Query has backported this interface, we are deprecating the backported version from @suspensive/react-query. Please migrate to the official TanStack Query interface:
> 
> ```diff
- import { infiniteQueryOptions } from '@suspensive/react-query'
+ import { infiniteQueryOptions } from '@tanstack/react-query'
```
> 
> For more details, see [TanStack Query PR #9334](https://github.com/TanStack/query/pull/9334).

`infiniteQueryOptions` helps utilize queryOptions in Infinite Query. This provides similar benefits to the ones offered by [`queryOptions`](https://suspensive.org/docs/react-query/queryOptions).

```jsx /infiniteQueryOptions/
import { infiniteQueryOptions, useSuspenseInfiniteQuery, SuspenseInfiniteQuery } from '@suspensive/react-query'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'

const postsInfiniteQueryOptions = (page) =>
  infiniteQueryOptions({
    queryKey: ['posts', page] as const,
    queryFn: ({
      queryKey: [, page], // You can use queryKey.
    }) => fetch(`https://example.com/posts?page=${page}`).then(res => res.json()),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? false,
  })

// No need to create a custom query hook.
// You can directly utilize infiniteQueryOptions in useInfiniteQuery, useSuspenseInfiniteQuery, and SuspenseInfiniteQuery.
const postsQuery = useInfiniteQuery(postsInfiniteQueryOptions(1))
const { data: posts, fetchNextPage, hasNextPage } = useSuspenseInfiniteQuery({
  ...postsInfiniteQueryOptions(1),
  refetchInterval: 2000, // Extensibility is clearly expressed in usage.
})
const Example = () => (
  <SuspenseInfiniteQuery {...postsInfiniteQueryOptions(1)}>
    {({ data, fetchNextPage, hasNextPage }) => (
      <div>
        {data.pages.map((page, index) => (
          <div key={index}>
            {page.posts.map(post => (
              <div key={post.id}>{post.title}</div>
            ))}
          </div>
        ))}
        <button onClick={() => fetchNextPage()} disabled={!hasNextPage}>
          Load More
        </button>
      </div>
    )}
  </SuspenseInfiniteQuery>
)

// You can easily use queryKey and queryFn in queryClient's methods.
const queryClient = useQueryClient()
queryClient.refetchQueries(postsInfiniteQueryOptions(1))
queryClient.prefetchQuery(postsInfiniteQueryOptions(1))
queryClient.invalidateQueries(postsInfiniteQueryOptions(1))
queryClient.fetchQuery(postsInfiniteQueryOptions(1))
queryClient.resetQueries(postsInfiniteQueryOptions(1))
queryClient.cancelQueries(postsInfiniteQueryOptions(1))
```

### Version History

| Version  | Changes                                                                                                                       |
| -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `v3.0.0` | `networkMode` has been removed. For more details, please refer to the [Migration to v3 guide](./migration/migrate-to-v3.mdx). |
