---
url: /docs/react/ErrorBoundaryGroup
---

# ErrorBoundaryGroup

This is a component for managing multiple `<ErrorBoundary/>`s easily.

`<ErrorBoundary/>`s as children of nested `<ErrorBoundaryGroup/>` will also be reset by parent `<ErrorBoundaryGroup.Consumer/>`.

```jsx /ErrorBoundaryGroup/
import { ErrorBoundaryGroup, ErrorBoundary } from '@suspensive/react'

const Example = () => (
  <ErrorBoundaryGroup>
    {/* Resets all ErrorBoundaries that are children of ErrorBoundaryGroup. All ErrorBoundaries within nested ErrorBoundaryGroups are also reset. */}
    <ErrorBoundaryGroup.Consumer>
      {(group) => <button onClick={group.reset}>Try again</button>}
    </ErrorBoundaryGroup.Consumer>
    <ErrorBoundary fallback={(props) => <>{props.error.message}</>}>
      <ErrorAfter2s />
    </ErrorBoundary>
    <ErrorBoundaryGroup>
      <ErrorBoundaryGroup.Consumer>
        {(group) => <button onClick={group.reset}>Try again</button>}
      </ErrorBoundaryGroup.Consumer>
      <ErrorBoundary fallback={(props) => <>{props.error.message}</>}>
        <ErrorAfter2s />
      </ErrorBoundary>
    </ErrorBoundaryGroup>
  </ErrorBoundaryGroup>
)
```

### props.blockOutside

If you want to block resetting nested `<ErrorBoundaryGroup/>` by parent `<ErrorBoundaryGroup/>`, use blockOutside.

```jsx /blockOutside/
import { ErrorBoundaryGroup, ErrorBoundary } from '@suspensive/react'

const Example = () => (
  <ErrorBoundaryGroup>
    <ErrorBoundaryGroup.Consumer>
      {(group) => <button onClick={group.reset}>Try again</button>}
    </ErrorBoundaryGroup.Consumer>
    <ErrorBoundary fallback={(props) => <>{props.error.message}</>}>
      <ErrorAfter2s />
    </ErrorBoundary>

    {/* blockOutside prop prevents reset by the parent ErrorBoundaryGroup. */}
    <ErrorBoundaryGroup blockOutside>
      <ErrorBoundaryGroup.Consumer>
        {(group) => <button onClick={group.reset}>Try again</button>}
      </ErrorBoundaryGroup.Consumer>
      <ErrorBoundary fallback={(props) => <>{props.error.message}</>}>
        <ErrorAfter2s />
      </ErrorBoundary>
    </ErrorBoundaryGroup>
  </ErrorBoundaryGroup>
)
```

## ErrorBoundaryGroup.with

`ErrorBoundaryGroup.with` is a higher-order component that wraps the component with `<ErrorBoundaryGroup/>`.
`ErrorBoundaryGroup.with` makes it easy to wrap a component.

```tsx /ErrorBoundaryGroup.with/
import { ErrorBoundaryGroup } from '@suspensive/react'

const Example = ErrorBoundaryGroup.with({}, () => {
  return <>...</>
})
```

## ErrorBoundaryGroup.Consumer

`ErrorBoundaryGroup.Consumer` is a consumer of `<ErrorBoundaryGroup/>`. You can use `ErrorBoundaryGroup.Consumer` to use reset of `<ErrorBoundaryGroup/>`.

```tsx /ErrorBoundaryGroup.Consumer/
import { ErrorBoundaryGroup } from '@suspensive/react'

const Example = () => (
  <ErrorBoundaryGroup>
    <ErrorBoundaryGroup.Consumer>
      {(group) => <button onClick={group.reset}>Try again</button>}
    </ErrorBoundaryGroup.Consumer>
    <ErrorBoundary>
      <ErrorAfter2s />
    </ErrorBoundary>
  </ErrorBoundaryGroup>
)
```

## useErrorBoundaryGroup

If you use useErrorBoundaryGroup, you can get a function to reset `<ErrorBoundary/>`s in `<ErrorBoundaryGroup/>`.

```tsx /useErrorBoundaryGroup/
import { useErrorBoundaryGroup } from '@suspensive/react'

const Example = () => {
  const group = useErrorBoundaryGroup()

  return <button onClick={group.reset}>Try again</button>
}
```
