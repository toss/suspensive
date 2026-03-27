---
url: /docs/react-query/useSuspenseInfiniteQuery
---

# useSuspenseInfiniteQuery

> **Warning:** **Deprecated in @suspensive/react-query**
> 
> This hook is now officially supported in TanStack Query v4.40.0+. Since TanStack Query has backported this interface, we are deprecating the backported version from @suspensive/react-query. Please migrate to the official TanStack Query interface:
> 
> ```diff
- import { useSuspenseInfiniteQuery } from '@suspensive/react-query'
+ import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
```
> 
> For more details, see [TanStack Query PR #9334](https://github.com/TanStack/query/pull/9334).

Return type of this hook has no isLoading, isError property. because `<Suspense/>` and `<ErrorBoundary/>` guarantee the data from this hook. In addition, this hook's options have default suspense: true, and you can provide new options to this hook like [useInfiniteQuery](https://tanstack.com/query/v4/docs/react/reference/useInfiniteQuery) of @tanstack/react-query.

```tsx /useSuspenseInfiniteQuery/
import { useSuspenseInfiniteQuery } from '@suspensive/react-query'

const Example = () => {
  const query = useSuspenseInfiniteQuery({
    queryKey,
    queryFn,
  }) // suspense:true is default.

  // No need to do type narrowing by isSuccess.
  query.data // InfiniteData<TData>
}
```

### Motivation

If you turn suspense on in @tanstack/react-query, You can use [useInfiniteQuery](https://tanstack.com/query/v4/docs/react/reference/useInfiniteQuery) with `<Suspense/>` and `<ErrorBoundary/>`.

```tsx /useInfiniteQuery/
import { useInfiniteQuery } from '@tanstack/react-query'

const Example = () => {
  const query = useInfiniteQuery({
    queryKey,
    queryFn,
    suspense: true,
  })

  query.data // InfiniteData<TData> | undefined

  if (query.isSuccess) {
    query.data // InfiniteData<TData>
  }
}
```

but useInfiniteQuery's return type query.data will always be fulfilled because of `<Suspense/>` as parent of this component.

This is why @suspensive/react-query provide **useSuspenseInfiniteQuery**.

> **Note:** Focus on successful cases.
> 
> Now we can focus on the component, as data fetching will always succeed.

### Version History

| Version  | Changes                                                                                                                                   |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `v3.0.0` | `networkMode` has been fixed to `'always'`. For more details, please refer to the [Migration to v3 guide](./migration/migrate-to-v3.mdx). |
