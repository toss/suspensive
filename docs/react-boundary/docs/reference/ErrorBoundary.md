---
sidebar_position: 2
title: ErrorBoundary
---

This component provide a simple and reusable wrapper that you can use to wrap around your components. Any rendering errors in your components hierarchy can then be gracefully handled.

![Example banner](./../../static/gif/errorboundary-example.gif)

### Default mode

If there is thrown error in children, ErrorBoundary will catch it and then fallback will be rendered.

```tsx
const Example = () => {
  return (
    <ErrorBoundary fallback={({ error, reset }) => <button onClick={reset}>{JSON.stringify(error)}</button>}>
      <ErrorAfter4s />
    </ErrorBoundary>
  );
};

type BaseAsyncState<IsError extends boolean, Error> = { isError: IsError; error: Error };
type AsyncState = BaseAsyncState<true, any> | BaseAsyncState<false, null>;

const ErrorAfter4s = () => {
  const [asyncState, setAsyncState] = useState<AsyncState>({ isError: false, error: null });

  useEffect(() => {
    setTimeout(() => {
      setAsyncState({ isError: true, error: { status: 401, message: 'unauthorized' } });
    }, 4000);
  }, []);

  if (asyncState.isError) {
    throw asyncState.error;
  }

  return <>No error</>;
};
```

### ResetKey mode

Use ResetKey mode to inject resetKey for resetting multiple ErrorBoundary at once.
after providing [ResetKey](https://react-boundary.suspensive.org/docs/reference/ResetKey) and turn on ErrorBoundary's ResetKey mode will make you easily bind resetKey at once.

```tsx
const Example = withResetKey({ reset }) => {
  return (
    <>
      <button onClick={reset}>Reset at once</button>
      <ErrorBoundary.ResetKey>
        <ErrorAfter4s />
      </ErrorBoundary.ResetKey>
      <ErrorBoundary.ResetKey>
        <ErrorAfter4s />
      </ErrorBoundary.ResetKey>
      <ErrorBoundary.ResetKey>
        <ErrorAfter4s />
      </ErrorBoundary.ResetKey>
    </>
  );
};
```

## Props

```tsx
type Props = PropsWithRef<
  PropsWithChildren<{
    resetKeys?: unknown[]
    onReset?(): void
    onError?(error: Error, info: ErrorInfo): void
    fallback:
      | ReactNode
      | ((props: { error: Error; reset: (...args: unknown[]) => void }) => ReactNode)
  }>
>
```
