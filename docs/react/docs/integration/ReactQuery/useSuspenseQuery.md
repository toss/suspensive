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

  query.data // Tdata | undefined

  if (query.isSuccess) {
    query.data // Tdata
  }
}
```

but useQuery's return type will be same even though suspense mode on.
query.data will be fulfilled because of Suspense as parent of this component.

This is why @suspensive/react-query provide **useSuspenseQuery**

## useSuspenseQuery

Return type of this hook have no isLoading, isError property. because Suspense and ErrorBoundary will guarantee this hook's data.

In addition, this hook's option have default suspense: true. and you can provide new option to this hook like useQuery of @tanstack/react-query.

```tsx

import { useSuspenseQuery } from '@suspensive/react-query'

const Example = () => {
  const query = useSuspenseQuery(queryKey, queryFn, options) // suspense:true is default.

  // No need to do type narrowing by isSuccess
  query.data // Tdata 
}
```

### Concentrate on only Success

Now, we can concentrate component as any fetching will be always success.
