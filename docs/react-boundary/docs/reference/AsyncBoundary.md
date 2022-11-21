---
sidebar_position: 3
title: AsyncBoundary
---

This component is just wrapping [Suspense](https://react-boundary.suspensive.org/docs/reference/Suspense) and [ErrorBoundary](https://react-boundary.suspensive.org/docs/reference/ErrorBoundary) in this library. to use Suspense with ErrorBoundary at once.

## Props

```ts
interface Props
  extends Omit<SuspenseProps, 'fallback'>,
    Omit<ErrorBoundaryProps, 'fallback'> {
  pendingFallback: SuspenseProps['fallback']
  rejectedFallback: ErrorBoundaryProps['fallback']
}
```

## Examples

### AsyncBoundary

default AsyncBoundary of @suspensive/react-boundary will return just ErrorBoundary wrapping default Suspense, not Suspense.CSROnly.

```tsx
const AsyncBoundaryDefault = () => {
  const { resetBoundaryKey } = useResetBoundary()

  return (
    <AsyncBoundary
      pendingFallback={<Loading />}
      rejectedFallback={({ reset, error }) => (
        <button onClick={reset}>{JSON.stringify(error)}</button>
      )}
      resetKeys={[resetBoundaryKey]}
      onReset={() => {
        console.log('ErrorBoundary in AsyncBoundary has reset')
      }} // ex) reset react-query cache on ErrorBoundary reset.
      onError={(error, info) => {
        alert(JSON.stringify(error))
      }}
    >
      <Children />
    </AsyncBoundary>
  )
}
```

### AsyncBoundary.CSROnly

But if you turn on CSROnly, AsyncBoundary.CSROnly will return ErrorBoundary wrapping Suspense.CSROnly, not default Suspense.
In server, Suspense.CSROnly return fallback only. so AsyncBoundary.CSROnly return pendingFallback only.

```tsx
/** Suspense.CSROnly in AsyncBoundary will return pendingFallback first.
After mount, return children of AsyncBoundary.CSROnly only in client.
but if there is error in AsyncBoundary, ErrorBoundary in AsyncBoundary will catch this thrown error.
then rejectedFallback will expose. */

const AsyncBoundaryAvoidSSR = () => {
  const { resetBoundaryKey } = useResetBoundary()

  return (
    <AsyncBoundary.CSROnly
      pendingFallback={<Loading />}
      rejectedFallback={({ reset, error }) => (
        <button onClick={reset}>{JSON.stringify(error)}</button>
      )}
      resetKeys={[resetBoundaryKey]}
      onReset={() => {
        console.log('ErrorBoundary in AsyncBoundary has reset')
      }} // ex) reset react-query cache on ErrorBoundary reset.
      onError={(error, info) => {
        alert(JSON.stringify(error))
      }}
    >
      <Children />
    </AsyncBoundary.CSROnly>
  )
}
```

#### Migration support SSR gradually (AsyncBoundary.CSROnly -> default AsyncBoundary)
If you want to use default AsyncBoundary working in both SSR/CSR, You can change AsyncBoundary.CSROnly to default AsyncBoundary gradually.
