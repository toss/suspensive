---
sidebar_position: 3
title: ErrorBoundaryGroup
---

This is a component for managing multiple ErrorBoundaries at once.

If you use ErrorBoundaryGroup, you can easily reset multiple ErrorBoundaries at once if they are children of ErrorBoundaryGroup, without having to connect resetKey state to resetKeys of multiple ErrorBoundary.

### ErrorBoundaryGroup.Reset

Multiple ErrorBoundary as children of ErrorBoundaryGroup can be reset at once by ErrorBoundaryGroup.Reset.

```tsx
const Example = () => (
  <ErrorBoundaryGroup>
    <ErrorBoundaryGroup.Reset trigger={(group) => <button onClick={group.reset}>Reset Children</button>} />
    <ErrorBoundary />
    <AsyncBoundary /* ErrorBoundary wrapped by AsyncBoundary also will be reset by ErrorBoundaryGroup.Reset */ />
  </ErrorBoundaryGroup>
)
```

### withErrorBoundaryGroup, useErrorBoundaryGroup

If you want to use HOC(Higher Order Component) with hook, Use withErrorBoundaryGroup, useErrorBoundaryGroup.

```tsx
const Example = withErrorBoundaryGroup(() => {
  const group = useErrorBoundaryGroup()

  return (
    <>
      <button onClick={group.reset}>Reset All</button>
      <ErrorBoundary />
      <AsyncBoundary />
    </>
  )
})
```

### Nested ErrorBoundaryGroup

ErrorBoundary as children of nested ErrorBoundaryGroup will be reset by parent ErrorBoundaryGroup.Reset.
But nested ErrorBoundaryGroup.Reset will reset only ErrorBoundary inside of nested ErrorBoundaryGroup self.

```tsx
const Example = () => (
  <ErrorBoundaryGroup>
    <ErrorBoundaryGroup.Reset /* reset all of children */ />
    <ErrorBoundary />
    <AsyncBoundary />
    <ErrorBoundaryGroup>
      <ErrorBoundaryGroup.Reset /* reset all of children */ />
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
    <ErrorBoundaryGroup blockOutside /* block resetting by parent ErrorBoundaryGroup */>
      <ErrorBoundaryGroup.Reset />
      <ErrorBoundary />
      <AsyncBoundary />
    </ErrorBoundaryGroup>
  </ErrorBoundaryGroup>
)
```
