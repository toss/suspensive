---
url: /docs/react-query/usePrefetchQuery
---

# usePrefetchQuery

The usePrefetchQuery does not return anything, it should be used just to fire a prefetch during render, before a suspense boundary that wraps a component that uses useSuspenseQuery.

```jsx /usePrefetchQuery/
import { usePrefetchQuery, useSuspenseQuery } from '@suspensive/react-query'

const PostPage = ({ postId }) => {
  usePrefetchQuery({
    queryKey: ['posts', postId],
    queryFn: () => getPost(postId),
  }) // Prefetch query before suspense boundary

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Post postId={postId} />
    </Suspense>
  )
}

export const Post = ({ postId }) => {
  const { data } = useSuspenseQuery({
    queryKey: ['posts', postId],
    queryFn: () => getPost(postId),
  })

  return <>...</>
}
```
