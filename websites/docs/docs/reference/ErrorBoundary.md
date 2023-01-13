---
sidebar_position: 2
title: ErrorBoundary
---

This component provide a simple and reusable wrapper that you can use to wrap around your components. Any rendering errors in your components hierarchy can then be gracefully handled.

![Example banner](./../../static/gif/errorboundary-example.gif)

## ErrorBoundary

### fallback

If there is any thrown error in children, ErrorBoundary will catch it and then fallback will be rendered.

```tsx
const Example = () => {
  return (
    <ErrorBoundary fallback={({ error, reset }) => <button onClick={reset}>{JSON.stringify(error)}</button>}>
      <ErrorAfter4s />
    </ErrorBoundary>
  );
};

const ErrorAfter4s = () => {
  const [asyncState, setAsyncState] = useState<{ isError: true; error: Error } | { isError: false; error: null }>({ isError: false, error: null });

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

### resetKeys: unknown[]

If you want to reset ErrorBoundary by component where is outside of ErrorBoundary's fallback. Inject any resetKey in resetKeys. resetKeys work only when at least one element of array is changed. you don't need to worry about provide new array as resetKeys like how useEffect's dependency array work.

```tsx
const Example = () => {
  const [resetKey, setResetKey] = useState(0)

  const resetOutside = () => setResetKey(prev => prev + 1)

  return (
    <>
      <button onClick={resetOutside} />
      <ErrorBoundary resetKeys={[resetKey]}>
        <ErrorAfter4s />
      </ErrorBoundary>
    </>
  );
};
```

## ErrorBoundaryGroup

### ErrorBoundaryGroup.Reset

Multiple ErrorBoundary as children of ErrorBoundaryGroup can be reset at once by ErrorBoundaryGroup.Reset.

```tsx
const Example = () => (
  <ErrorBoundaryGroup>
    <ErrorBoundaryGroup.Reset trigger={({ resetGroup }) => <button onClick={resetGroup}>Reset Children</button>} />
    <ErrorBoundary />
    <AsyncBoundary /> {/* ErrorBoundary wrapped by AsyncBoundary also will be reset by ErrorBoundaryGroup.Reset */}
  </ErrorBoundaryGroup>
)
```

### withErrorBoundaryGroup, useErrorBoundaryGroup

If you want to use HOC(Higher Order Component) with hook, Use withErrorBoundaryGroup, useErrorBoundaryGroup.

```tsx
const Example = withErrorBoundaryGroup(() => {
  const { resetGroup } = useErrorBoundaryGroup()

  return (
    <>
      <button onClick={resetGroup}>Reset All</button>
      <ErrorBoundary />
      <AsyncBoundary />
    </>
  )
})
```

### Nested ErrorBoundaryGroup

ErrorBoundary as children of nested ErrorBoundaryGroup will be reset by parent ErrorBoundary.Reset.
But nested ErrorBoundary.Reset will reset only ErrorBoundary inside of nested ErrorBoundaryGroup self.

```tsx
const Example = () => (
  <ErrorBoundaryGroup>
    <ErrorBoundaryGroup.Reset /> {/* reset all of children */}
    <ErrorBoundary />
    <AsyncBoundary />
    <ErrorBoundaryGroup>
      <ErrorBoundaryGroup.Reset /> {/* reset all of children */}
      <ErrorBoundary />
      <AsyncBoundary />
    </ErrorBoundaryGroup>
  </ErrorBoundaryGroup>
)
```

### blockOutside: boolean

If you want to block resetting nested ErrorBoundaryGroup by parent ErrorBoundaryGroup, Use blockOutside.

```tsx
const Example = () => (
  <ErrorBoundaryGroup>
    <ErrorBoundaryGroup.Reset />
    <ErrorBoundary />
    <AsyncBoundary />
    <ErrorBoundaryGroup blockOutside> {/* block resetting by parent */}
      <ErrorBoundaryGroup.Reset />
      <ErrorBoundary />
      <AsyncBoundary />
    </ErrorBoundaryGroup>
  </ErrorBoundaryGroup>
)
```
