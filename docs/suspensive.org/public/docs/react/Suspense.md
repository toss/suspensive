---
url: /docs/react/Suspense
---

# Suspense

@suspensive/react's `<Suspense/>` will be just [Suspense of original React](https://react.dev/reference/react/Suspense).

### props.fallback

fallback works the same as the fallback of React's original Suspense.

```tsx /Suspense/
import { Suspense } from '@suspensive/react'

const Example = () => (
  <Suspense fallback={<Loading />}>
    <Children />
  </Suspense>
)
```

> **Note:** Default fallback
> 
> `<Suspense/>` are more powerful when used with `<DefaultPropsProvider/>`.
> Control multiple `<Suspense/>`s default fallback with `<DefaultPropsProvider/>`. Details are introduced in [`<DefaultPropsProvider/>` page](/docs/react/DefaultPropsProvider).

### Avoid Server side rendering (clientOnly)

If you use the clientOnly prop, `<Suspense/>` will return fallback in server and return children in client.

```tsx /clientOnly/
import { Suspense } from '@suspensive/react'

const Example = () => (
  <Suspense clientOnly fallback={<Loading />}>
    <Children />
  </Suspense>
)
```

When using the clientOnly prop, the useIsClient hook is used internally, and useIsClient uses getSnapshot and getServerSnapshot of useSyncExternalStore to ensure that it is a client.

```tsx /useIsClient/
const useIsClient = () =>
  useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot)

const emptySubscribe = () => noop
const getSnapshot = () => true
const getServerSnapshot = () => false
```

https://x.com/TkDodo/status/1741068994981826947?t=XmG17etMUL2m0JFim03vqw&s=19

> **Info:** Migration support SSR gradually (`<Suspense clientOnly/>` -> `<Suspense/>`)
> 
> If you want to use Suspense working in both SSR/CSR, you can change `<Suspense clientOnly/>` to `<Suspense/>` gradually.

## Suspense.with

`Suspense.with` is a higher-order component (HOC) that allows you to wrap a component with a Suspense boundary.
`Suspense.with` makes it easy to wrap a component.

```tsx /Suspense.with/
import { Suspense } from '@suspensive/react'

const Example = Suspense.with({ fallback: <Spinner /> }, () => {
  // code that triggers suspense

  return <>...</>
})
```
