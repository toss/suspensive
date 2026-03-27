---
url: /docs/react-query/mutationOptions
---

# mutationOptions

`mutationOptions` helps you easily reuse and consistently manage option objects for Mutations. This provides similar benefits to the ones offered by [`queryOptions`](/docs/react-query/queryOptions).

```jsx /mutationOptions/
import { mutationOptions, useMutation, Mutation } from '@suspensive/react-query'

const editPostMutationOptions = (postId: number) =>
  mutationOptions({
    mutationFn: (content: string) => fetch(`https://example.com/posts/${postId}`, {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    }).then(res => res.json()),
  })

// You can directly use mutationOptions without creating custom mutation hooks.
const editPostMutation = useMutation(editPostMutationOptions(1))

// Directly use mutationOptions with <Mutation />.
const Example = () => (
  <Mutation {...editPostMutationOptions(1)}>
    {({ mutate, isLoading }) => (
      <div>
        <p>{isLoading ? 'Updating...' : 'Latest updated'}</p>
        <textarea onBlur={(e) => mutate(e.target.value)} disabled={isLoading} />
      </div>
    )}
  </Mutation>
)
```
