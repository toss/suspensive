---
sidebar_position: 2
title: ErrorBoundary
---



## Props

```ts
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

## Example

![Example banner](./../../static/gif/errorboundary-example.gif)

```ts
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
