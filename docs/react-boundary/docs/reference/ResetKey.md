---
sidebar_position: 4
title: ResetKey
---

This component provide resetKey to reset multiple ErrorBoundary at once.

## Examples

### Default mode

ResetKey provide resetKey to reset at once in children. also consume ResetKey at once. or Turn on ResetKey mode on ErrorBoundary, AsyncBoundary.

```tsx
const Default = () => (
  <ResetKey>
    {({ reset, resetKey }) => (
      <>
        <button onClick={reset}>reset at once</button>
        <ErrorBoundary resetKeys={[resetKey]} />
        <AsyncBoundary resetKeys={[resetKey]} />
        <ErrorBoundary.ResetKey />
        <AsyncBoundary.ResetKey />
      </>
    )}
  </ResetKey>
)
```

### Provider, Consumer mode

If you want to use more customizable ResetKey, use Provider, Consumer mode.

```tsx
const Default = () => (
  <ResetKey.Provider>
    <Resetter />
    <ErrorBoundary.ResetKey />
    <AsyncBoundary.ResetKey />
  </ResetKey.Provider>
)

const Resetter = () => (
  <ResetKey.Consumer>{({ reset }) => <button onClick={reset}>reset at once</button>}</ResetKey.Consumer>
)
```
