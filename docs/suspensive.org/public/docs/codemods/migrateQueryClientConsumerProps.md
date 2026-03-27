---
url: /docs/codemods/migrateQueryClientConsumerProps
---

# Migrate `<QueryClientConsumer/>` Props

> **Info:** This codemod is recommended for updating `@suspensive/react-query` & `@tanstack/react-query@4` to `@tanstack/react-query@5`.

In the `@suspensive/react-query` & `@tanstack/react-query@5` environment, the `context` prop of the `<QueryClientConsumer/>` component provided by `@suspensive/react-query` has been changed to `queryClient`.

```bash filename="Terminal"
npx @suspensive/codemods migrate-query-client-consumer-props .
```

Using this codemod, you can automatically transform the `context` prop into `queryClient`.

For example:

```tsx /context/
const PostRefreshButton = () => {
  return (
    <QueryClientConsumer context={queryClientContext}>
      {(queryClient) => (
        <button
          onClick={() =>
            queryClient.invalidateQueries({
              queryKey: ['posts'],
            })
          }
        >
          Posts refresh
        </button>
      )}
    </QueryClientConsumer>
  )
}
```

Transforms into:

```tsx /queryClient/
const PostRefreshButton = () => {
  return (
    {/** The 'context' prop is now transformed into 'queryClient'! */}
    <QueryClientConsumer queryClient={queryClient}>
      {(queryClient) => (
        <button
          onClick={() =>
            queryClient.invalidateQueries({
              queryKey: ['posts'],
            })
          }
        >
          Posts refresh
        </button>
      )}
    </QueryClientConsumer>
  )
}
```
