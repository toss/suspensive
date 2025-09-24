# @suspensive/check-parent-suspense

Ensures that components using Suspense-related APIs are wrapped in a Suspense boundary.

## Rule Details

This rule checks that components using Suspense-related hooks and components are properly wrapped in a `<Suspense>` component boundary within the same component scope.

### Suspense-related APIs checked:

**Hooks:**

- `useSuspenseQuery`
- `useSuspenseInfiniteQuery`
- `useSuspenseQueries`

**Components:**

- `SuspenseQuery`
- `SuspenseInfiniteQuery`
- `SuspenseQueries`

**Lazy components:**

- Components created with `lazy()` function

## Examples

### ❌ Incorrect

```tsx
// Hook without Suspense wrapper
function MyComponent() {
  const data = useSuspenseQuery(queryOptions)
  return <div>{data}</div>
}

// Component without Suspense wrapper
function MyComponent() {
  return <SuspenseQuery>{(data) => <div>{data}</div>}</SuspenseQuery>
}

// Lazy component without Suspense wrapper
const LazyComponent = lazy(() => import('./Component'))

function MyApp() {
  return <LazyComponent />
}
```

### ✅ Correct

```tsx
// Hook with Suspense wrapper
function MyComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        {(() => {
          const data = useSuspenseQuery(queryOptions)
          return <div>{data}</div>
        })()}
      </div>
    </Suspense>
  )
}

// Component with Suspense wrapper
function MyComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuspenseQuery>{(data) => <div>{data}</div>}</SuspenseQuery>
    </Suspense>
  )
}

// Lazy component with Suspense wrapper
const LazyComponent = lazy(() => import('./Component'))

function MyApp() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  )
}
```

## Options

The rule accepts an options object with the following properties:

- `suspenseHooks` (array): List of hook names to check. Default: `['useSuspenseQuery', 'useSuspenseInfiniteQuery', 'useSuspenseQueries']`
- `suspenseComponents` (array): List of component names to check. Default: `['SuspenseQuery', 'SuspenseInfiniteQuery', 'SuspenseQueries']`
- `suspenseWrappers` (array): List of valid Suspense wrapper component names. Default: `['Suspense']`

### Example configuration

```json
{
  "rules": {
    "@suspensive/check-parent-suspense": [
      "error",
      {
        "suspenseHooks": ["useSuspenseQuery", "useCustomSuspenseHook"],
        "suspenseComponents": ["SuspenseQuery", "CustomSuspenseComponent"],
        "suspenseWrappers": ["Suspense", "CustomSuspense"]
      }
    ]
  }
}
```

## When Not To Use It

This rule enforces Suspense boundaries within the same component scope. In some patterns, components using Suspense APIs may be rendered within Suspense boundaries defined in parent components. If you're using such patterns and want to allow them, you can disable the rule for specific lines:

```tsx
const MyComponent = () => {
  // eslint-disable-next-line @suspensive/check-parent-suspense
  const data = useSuspenseQuery(queryOptions)
  return <div>{data}</div>
}
```

## Related Rules

- React's built-in Suspense documentation: https://react.dev/reference/react/Suspense
- @tanstack/react-query Suspense documentation
