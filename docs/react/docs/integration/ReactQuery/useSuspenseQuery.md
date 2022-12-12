---
sidebar_position: 2
title: "useSuspenseQuery"
---

### Motivation

If you turn suspense mode on in @tanstack/react-query, You can use useQuery with Suspense and ErrorBoundary.

```tsx
import { useQuery } from '@tanstack/react-query'

const Example = () => {
  const query = useQuery(queryKey, queryFn, {
    suspense: true,
  })

  query.data // TData | undefined

  if (query.isSuccess) {
    query.data // TData
  }
}
```

but useQuery's return type:query.data will be always fulfilled because of Suspense as parent of this component.

This is why @suspensive/react-query provide **useSuspenseQuery**

## useSuspenseQuery

Return type of this hook have no isLoading, isError property. because Suspense and ErrorBoundary will guarantee this hook's data.

In addition, this hook's options have default suspense: true. and you can provide new options to this hook like useQuery of @tanstack/react-query.

```tsx

import { useSuspenseQuery } from '@suspensive/react-query'

const Example = () => {
  const query = useSuspenseQuery(queryKey, queryFn, options) // suspense:true is default.

  // No need to do type narrowing by isSuccess
  query.data // TData 
}
```

### Concentrate on only Success

Now, we can concentrate component as any fetching will be always success.
