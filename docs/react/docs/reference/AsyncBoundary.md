---
sidebar_position: 3
title: AsyncBoundary
---

This component is just wrapping [Suspense](https://react.suspensive.org/docs/reference/Suspense) and [ErrorBoundary](https://react.suspensive.org/docs/reference/ErrorBoundary) in this library. to use Suspense with ErrorBoundary at once easily.

### Default mode

default AsyncBoundary will return just default Suspense with ErrorBoundary.

```tsx
const AsyncBoundaryDefault = () => (
  <AsyncBoundary
    pendingFallback={<Loading />}
    rejectedFallback={({ reset, error }) => <button onClick={reset}>{JSON.stringify(error)}</button>}
    onReset={() => console.log('ErrorBoundary in AsyncBoundary has reset')} // ex) reset react-query cache on ErrorBoundary reset.
    onError={(error, info) => alert(JSON.stringify(error))}
  >
    <Children />
  </AsyncBoundary>
)
```

### CSROnly mode

But if you use CSROnly mode, AsyncBoundary.CSROnly will return ErrorBoundary with Suspense.CSROnly, not default Suspense.
In server, Suspense.CSROnly return fallback only. so AsyncBoundary.CSROnly return only pendingFallback in server.

```tsx
/** First, AsyncBoundary.CSROnly return pendingFallback.
After mount, return children only in client.
but if there is error in children, AsyncBoundary will catch this thrown error.
then rejectedFallback will be rendered. */

const AsyncBoundaryAvoidSSR = () => (
  <AsyncBoundary.CSROnly
    pendingFallback={<Loading />}
    rejectedFallback={({ reset, error }) => <button onClick={reset}>{JSON.stringify(error)}</button>}
    onReset={() => console.log('ErrorBoundary in AsyncBoundary has reset')} // ex) reset react-query cache on ErrorBoundary reset.
    onError={(error, info) => alert(JSON.stringify(error))}
  >
    <Children />
  </AsyncBoundary.CSROnly>
)
```

#### Migration support SSR gradually (AsyncBoundary.CSROnly -> default AsyncBoundary)

If you want to use default AsyncBoundary working in both SSR/CSR, You can change AsyncBoundary.CSROnly to default AsyncBoundary gradually.


## Props

```tsx
type Props = Omit<SuspenseProps, 'fallback'> &
  Omit<ErrorBoundaryProps, 'fallback'> & {
    pendingFallback: SuspenseProps['fallback']
    rejectedFallback: ErrorBoundaryProps['fallback']
  }
```

