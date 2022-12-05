---
sidebar_position: 3
title: "QueryErrorBoundary, QueryAsyncBoundary"
---

### Motivation

With the [QueryErrorResetBoundary](https://tanstack.com/query/v4/docs/reference/QueryErrorResetBoundary) component you can reset any query errors within the boundaries of the component. but If you use react-query with suspense continuously, Continuous repeating to use QueryErrorResetBoundary + [ErrorBoundary](https://react.suspensive.org/docs/reference/ErrorBoundary), QueryErrorResetBoundary + [AsyncBoundary](https://react.suspensive.org/docs/reference/AsyncBoundary) will be coded.

#### QueryErrorResetBoundary + ErrorBoundary

```tsx
import { ErrorBoundary } from '@suspensive/react'
import { QueryErrorResetBoundary } from '@tanstack/react-query'

const Example = () => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary
        onReset={reset}
        fallback={({ reset: resetErrorBoundary }) => (
          <button onClick={resetErrorBoundary}>Try again</button>
        )}
      >
        <Page />
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
)
```

#### QueryErrorResetBoundary + AsyncBoundary

```tsx
import { AsyncBoundary } from '@suspensive/react'
import { QueryErrorResetBoundary } from '@tanstack/react-query'

const Example = () => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <AsyncBoundary
        onReset={reset}
        rejectedFallback={({ reset: resetAsyncBoundary }) => (
          <button onClick={resetAsyncBoundary}>Try again</button>
        )}
      >
        <Page />
      </AsyncBoundary>
    )}
  </QueryErrorResetBoundary>
)
```

@suspensive/react-query provide QueryErrorBoundary, QueryAsyncBoundary to reduce repeating implementation like using QueryErrorResetBoundary + ErrorBoundary, QueryErrorResetBoundary + AsyncBoundary.

## QueryErrorBoundary

```tsx
import { QueryErrorBoundary } from '@suspensive/react-query'

const Example = () => (
  <QueryErrorBoundary
    fallback={({ reset }) => (
      <button onClick={reset}>Try again</button>
    )}
  >
    <Page />
  </QueryErrorBoundary>
)
```

## QueryAsyncBoundary

```tsx
import { QueryAsyncBoundary } from '@suspensive/react-query'

const Example = () => (
  <QueryAsyncBoundary
    rejectedFallback={({ reset }) => (
      <button onClick={reset}>Try again</button>
    )}
  >
    <Page />
  </QueryAsyncBoundary>
)
```

You can just use QueryErrorBoundary / QueryAsyncBoundary like using [ErrorBoundary](https://react.suspensive.org/docs/reference/ErrorBoundary) / [AsyncBoundary](https://react.suspensive.org/docs/reference/AsyncBoundary). All other features are same with original ErrorBoundary, AsyncBoundary of @suspensive/react without resetting react-query's error.
