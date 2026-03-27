---
url: /docs/react/ErrorBoundary
---

# ErrorBoundary

This component can handle any errors in children.

## Comparison

`@suspensive/react`'s `<ErrorBoundary/>` provides a declarative, feature-rich alternative to React's class-based error boundaries and popular error boundary libraries like `react-error-boundary` and `@sentry/react`.

| Feature                                  | @suspensive/react | react-error-boundary   | @sentry/react          | React Class Component  |
| ---------------------------------------- | ----------------- | ---------------------- | ---------------------- | ---------------------- |
| Basic error catching                     | ✅                | ✅                     | ✅                     | ✅                     |
| Fallback UI with error & reset           | ✅                | ✅                     | ✅                     | ⚠️ (Manual)            |
| Reset with resetKeys                     | ✅                | ✅                     | ❌                     | ⚠️ (Manual)            |
| onReset callback                         | ✅                | ✅                     | ✅                     | ⚠️ (Manual)            |
| onError callback                         | ✅                | ✅                     | ✅                     | ✅ (componentDidCatch) |
| Conditional error catching (shouldCatch) | ✅                | ❌                     | ❌                     | ⚠️ (Manual)            |
| Fallback error handling                  | ✅ (To parent)    | ❌ (Recursive)         | ❌ (Recursive)         | ⚠️ (Manual)            |
| useErrorBoundary hook                    | ✅                | ✅                     | ❌                     | ❌                     |
| useErrorBoundaryFallbackProps hook       | ✅                | ❌                     | ❌                     | ❌                     |
| ErrorBoundaryGroup                       | ✅                | ❌                     | ❌                     | ❌                     |
| HOC support                              | ✅ (with)         | ✅ (withErrorBoundary) | ✅ (withErrorBoundary) | ❌                     |
| TypeScript error type inference          | ✅ (Advanced)     | ✅ (Basic)             | ✅ (Basic)             | ⚠️ (Manual)            |
| Declarative API                          | ✅                | ✅                     | ✅                     | ❌                     |
| Automatic error reporting                | ❌                | ❌                     | ✅ (To Sentry)         | ❌                     |

#### @suspensive/react

```tsx
import { ErrorBoundary } from '@suspensive/react'

const SuspensiveExample = () => (
  <ErrorBoundary
    fallback={({ error, reset }) => (
      <div>
        <button onClick={reset}>Reset</button>
        {error.message}
      </div>
    )}
  >
    <YourComponent />
  </ErrorBoundary>
)
```

#### react-error-boundary

```tsx
import { ErrorBoundary } from 'react-error-boundary'

const ReactErrorBoundaryExample = () => (
  <ErrorBoundary
    fallbackRender={({ error, resetErrorBoundary }) => (
      <div>
        <button onClick={resetErrorBoundary}>Reset</button>
        {error.message}
      </div>
    )}
  >
    <YourComponent />
  </ErrorBoundary>
)
```

#### @sentry/react

```tsx
import { ErrorBoundary } from '@sentry/react'

const SentryExample = () => (
  <ErrorBoundary
    fallback={({ error, resetError }) => (
      <div>
        <button onClick={resetError}>Reset</button>
        {error.message}
      </div>
    )}
  >
    <YourComponent />
  </ErrorBoundary>
)
```

#### React Class

```tsx
import { Component, ReactNode } from 'react'

class ErrorBoundary extends Component<
  { children: ReactNode; fallback: (error: Error) => ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback(this.state.error!)
    }
    return this.props.children
  }
}

// Usage
const ReactClassExample = () => (
  <ErrorBoundary
    fallback={(error) => (
      <div>
        <button onClick={() => window.location.reload()}>Reset</button>
        {error.message}
      </div>
    )}
  >
    <YourComponent />
  </ErrorBoundary>
)
```

### Key Advantages of @suspensive/react

1. **Advanced Error Filtering with shouldCatch**: Unlike other solutions, `@suspensive/react` allows you to conditionally catch specific errors using boolean, ErrorConstructor, or callback matchers. This enables sophisticated error handling strategies where parent and child ErrorBoundaries can handle different error types.

2. **Proper Fallback Error Handling**: Unlike `react-error-boundary`, errors thrown in fallback components are passed to the parent ErrorBoundary instead of being caught recursively by the same boundary. This prevents infinite fallback loops and provides more predictable error handling behavior. [Learn more](/docs/react/migration/migrate-to-v3#now-thrown-error-in-errorboundary-fallback-will-be-passed-to-parent-1409)

3. **useErrorBoundaryFallbackProps**: Eliminates prop drilling in fallback components by providing direct access to `error` and `reset` through a hook, making deeply nested fallback UIs much cleaner.

4. **ErrorBoundaryGroup**: Manage and reset multiple ErrorBoundaries together, perfect for complex UIs with multiple error boundaries that need coordinated reset behavior.

5. **Better TypeScript Support**: Advanced type inference for error types based on shouldCatch configuration, providing better autocomplete and type safety.

6. **No Class Components Required**: Unlike native React error boundaries, you can use a fully declarative, function component-based approach without writing class components.

### Migration Guide

#### From react-error-boundary

If you're using react-error-boundary, migrating to `@suspensive/react` is straightforward:

```tsx
// react-error-boundary
import { ErrorBoundary } from 'react-error-boundary'

const ReactErrorBoundaryExample = () => (
  <ErrorBoundary
    fallbackRender={({ error, resetErrorBoundary }) => (
      <div>
        <button onClick={resetErrorBoundary}>Reset</button>
        {error.message}
      </div>
    )}
    onReset={() => console.log('reset')}
  >
    <YourComponent />
  </ErrorBoundary>
)

// @suspensive/react - same functionality
import { ErrorBoundary } from '@suspensive/react'

const SuspensiveExample = () => (
  <ErrorBoundary
    fallback={({ error, reset }) => (
      <div>
        <button onClick={reset}>Reset</button>
        {error.message}
      </div>
    )}
    onReset={() => console.log('reset')}
  >
    <YourComponent />
  </ErrorBoundary>
)
```

Main API differences:

- `fallback`, `fallbackRender`, `FallbackComponent` → `fallback`
- `resetErrorBoundary` → `reset` (in fallback props)

#### @sentry/react

If you're using `@sentry/react`, migrating to `@suspensive/react` is straightforward:

```tsx
// @sentry/react
import * as Sentry from '@sentry/react'

const SentryExample = () => (
  <Sentry.ErrorBoundary
    fallback={({ error, resetError }) => (
      <div>
        <button onClick={resetError}>Reset</button>
        {error.message}
      </div>
    )}
    onError={(error, componentStack, eventId) => {
      // Error automatically sent to Sentry
      console.log('Error caught:', eventId)
    }}
  >
    <YourComponent />
  </Sentry.ErrorBoundary>
)

// @suspensive/react - with manual Sentry integration
import { ErrorBoundary } from '@suspensive/react'
import * as Sentry from '@sentry/react'

const SuspensiveExample = () => (
  <ErrorBoundary
    fallback={({ error, reset }) => (
      <div>
        <button onClick={reset}>Reset</button>
        {error.message}
      </div>
    )}
    onError={(error, errorInfo) => {
      const eventId = Sentry.captureReactException(error, errorInfo)
      console.log('Error caught:', eventId)
    }}
  >
    <YourComponent />
  </ErrorBoundary>
)
```

Main differences:

- `@sentry/react` automatically reports errors to Sentry
- `@suspensive/react` provides more flexible error handling with `shouldCatch`
- `resetError` → `reset` (in fallback props)
- Manual Sentry integration gives you more control over what gets reported

#### From React Class Component

If you're using React class components for error boundaries, `@suspensive/react` provides a much simpler declarative API:

```tsx
// React Class Component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    logErrorToService(error, errorInfo)
  }

  reset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return <FallbackComponent error={this.state.error} reset={this.reset} />
    }
    return this.props.children
  }
}

// @suspensive/react - much simpler!
import { ErrorBoundary } from '@suspensive/react'

const SuspensiveExample = () => (
  <ErrorBoundary
    fallback={({ error, reset }) => (
      <FallbackComponent error={error} reset={reset} />
    )}
    onError={(error, errorInfo) => logErrorToService(error, errorInfo)}
  >
    <YourComponent />
  </ErrorBoundary>
)
```

---

### props.fallback

If there is any thrown error in children of `<ErrorBoundary/>`, Error will be caught and then fallback will be rendered.

```tsx /fallback/
import { ErrorBoundary } from '@suspensive/react'
import { useState, useEffect } from 'react'

const Example = () => (
  <ErrorBoundary
    fallback={(props) => (
      <>
        <button onClick={props.reset}>Try again</button>
        {props.error.message}
      </>
    )}
  >
    <ErrorAfter2s />
  </ErrorBoundary>
)
```

> **Info:** Define component as `<ErrorBoundary/>`'s fallback
> 
> #### ErrorBoundaryFallbackProps
> 
> If you want to deliver a declared component as `<ErrorBoundary/>`'s fallback, you can use the `ErrorBoundaryFallbackProps` type to declare the component easily.
> 
> ```tsx /ErrorBoundaryFallbackProps/
import type { ErrorBoundaryFallbackProps } from '@suspensive/react'

const ErrorBoundaryFallback = ({
  reset,
  error,
}: ErrorBoundaryFallbackProps) => (
  <>
    <button onClick={reset}>reset</button>
    {error.message}
  </>
)

const Example = () => (
  <ErrorBoundary fallback={ErrorBoundaryFallback}>
    <ErrorAfter2s />
  </ErrorBoundary>
)
```

### props.resetKeys

If you want to reset `<ErrorBoundary/>` by a component that is outside of `<ErrorBoundary/>`'s fallback. Pass any resetKey into resetKeys. resetKeys work only when at least one element of array is changed. you don't need to worry about providing a new array as resetKeys like how useEffect's dependency array work.

```tsx /resetKeys/
import { ErrorBoundary } from '@suspensive/react'
import { useState } from 'react'

const Example = () => {
  const [resetKey, setResetKey] = useState(0)

  return (
    <>
      <button onClick={() => setResetKey((prev) => prev + 1)}>Try again</button>
      <ErrorBoundary resetKeys={[resetKey]}>
        <ErrorAfter2s />
      </ErrorBoundary>
    </>
  )
}
```

### props.onReset

This is a callback that is called first when `<ErrorBoundary/>` reset. It can be used with @tanstack/react-query as follows.

```tsx /onReset/
import { ErrorBoundary } from '@suspensive/react'
import { QueryErrorResetBoundary } from '@tanstack/react-query'

const Example = () => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary
        onReset={reset}
        fallback={(props) => (
          <>
            <button onClick={props.reset}>Try again</button>
            {props.error.message}
          </>
        )}
      >
        <Page />
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
)
```

### props.onError

This is a callback called when `<ErrorBoundary/>` catches an error.

```tsx /onError/
import { ErrorBoundary } from '@suspensive/react'

const logError = (error: Error, info: ErrorInfo) => {
  // ...
}

const Example = (
  <ErrorBoundary fallback={ErrorBoundaryFallback} onError={logError}>
    <ErrorAfter2s />
  </ErrorBoundary>
)
```

### props.shouldCatch

shouldCatch determines whether `<ErrorBoundary/>` should catch errors based on conditions.

It accepts three criteria: Boolean, ErrorConstructor, and Callback, and defaults to true.

#### ErrorConstructor

```tsx /shouldCatch/
import { ErrorBoundary } from '@suspensive/react'
import { useState, useEffect, createElement } from 'react'

export const Example = () => {
  return (
    <ErrorBoundary
      fallback={({ error }) => (
        <>Parent ErrorBoundary fallback: {error.message}</>
      )}
    >
      <ErrorBoundary
        shouldCatch={CustomError}
        fallback={({ error }) => (
          <>Child ErrorBoundary fallback: {error.message}</>
        )}
      >
        <CustomErrorAfter2s />
      </ErrorBoundary>
    </ErrorBoundary>
  )
}
```

#### Callback

```tsx /shouldCatch/
import { ErrorBoundary } from '@suspensive/react'
import { useState, useEffect, createElement } from 'react'

export const Example = () => {
  return (
    <ErrorBoundary
      fallback={({ error }) => (
        <>Parent ErrorBoundary fallback: {error.message}</>
      )}
    >
      <ErrorBoundary
        shouldCatch={(error) => error instanceof CustomError}
        fallback={({ error }) => (
          <>Child ErrorBoundary fallback: {error.message}</>
        )}
      >
        <CustomErrorAfter2s />
      </ErrorBoundary>
    </ErrorBoundary>
  )
}
```

#### Boolean

```tsx /shouldCatch/
import { ErrorBoundary } from '@suspensive/react'
import { useState, useEffect, createElement } from 'react'

export const Example = () => {
  return (
    <ErrorBoundary
      fallback={({ error }) => (
        <>Parent ErrorBoundary fallback: {error.message}</>
      )}
    >
      <ErrorBoundary
        shouldCatch={false}
        fallback={({ error }) => (
          <>Child ErrorBoundary fallback: {error.message}</>
        )}
      >
        <CustomErrorAfter2s />
      </ErrorBoundary>
    </ErrorBoundary>
  )
}
```

You can also apply multiple criteria through an array.

```tsx /shouldCatch/
import { ErrorBoundary } from '@suspensive/react'
import { useState, useEffect, createElement } from 'react'

const Example = () => {
  return (
    <ErrorBoundary
      fallback={({ error }) => (
        <>Parent ErrorBoundary fallback: {error.message}</>
      )}
    >
      <ErrorBoundary
        shouldCatch={[
          false,
          CustomError,
          (error) => error instanceof CustomError,
        ]}
        fallback={({ error }) => (
          <>Child ErrorBoundary fallback: {error.message}</>
        )}
      >
        <CustomErrorAfter2s />
      </ErrorBoundary>
    </ErrorBoundary>
  )
}
```

<br />

## ErrorBoundary.with

`ErrorBoundary.with` is a higher-order component that wraps the component with `<ErrorBoundary/>`.
`ErrorBoundary.with` makes it easy to wrap a component.

```tsx /ErrorBoundary.with/
import { ErrorBoundary } from '@suspensive/react'

const Example = ErrorBoundary.with({ fallback: ErrorBoundaryFallback }, () => {
  const errorBoundary = useErrorBoundary()

  return <>...</>
})
```

## useErrorBoundary

### useErrorBoundary().setError

In children of `<ErrorBoundary/>`, we can use useErrorBoundary().setError to make `<ErrorBoundary/>` aware of the Error without throwing.

```tsx /useErrorBoundary/
import { ErrorBoundary, useErrorBoundary } from '@suspensive/react'
import { useEffect } from 'react'

const Example = () => (
  <ErrorBoundary fallback={ErrorBoundaryFallback}>
    <SetErrorAfterFetch />
  </ErrorBoundary>
)

const SetErrorAfterFetch = () => {
  const errorBoundary = useErrorBoundary()

  useEffect(() => {
    fetchSomething().then(
      (response) => {},
      (error) => errorBoundary.setError(error) // instead of throw inside
    )
  }, [])

  return <>No error</>
}
```

## useErrorBoundaryFallbackProps

A hook that allows you to access the `error` object and `reset` method without prop drilling inside `<ErrorBoundary/>`'s fallback.

In Next.js React Server Component environments, callback functions cannot be passed as props from server components to client components. This makes it impossible to pass a function component as `<ErrorBoundary/>`'s `fallback` to receive `error` and `reset`. `useErrorBoundaryFallbackProps` allows you to access `error` and `reset` inside the fallback without this limitation.

It also eliminates the prop drilling problem when fallback components are deeply nested, removing the need to pass `error` and `reset` through multiple layers.

```tsx /useErrorBoundaryFallbackProps/
import { ErrorBoundary, useErrorBoundaryFallbackProps } from '@suspensive/react'

const ErrorBoundaryFallback = () => {
  const { reset, error } = useErrorBoundaryFallbackProps()

  return (
    <>
      <button onClick={reset}>Try again</button>
      {error.message}
    </>
  )
}

// In RSC, you need to pass JSX directly to fallback instead of a callback
const Example = () => (
  <ErrorBoundary fallback={<ErrorBoundaryFallback />}>
    <ErrorAfter2s />
  </ErrorBoundary>
)
```

> **Warning:** `useErrorBoundaryFallbackProps` must be called inside `<ErrorBoundary/>`'s `fallback`. Calling it in `<ErrorBoundary/>`'s `children` or outside of `<ErrorBoundary/>` will throw an error.
