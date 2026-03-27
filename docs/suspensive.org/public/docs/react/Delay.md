---
url: /docs/react/Delay
---

# Delay

This component can be used in two ways:

1. Delay the exposure of children.
2. If children is a render prop, it passes a flag at the delayed time.

### props.ms

#### 1. Delay the exposure of children

This component delays the exposure of children by ms. In the code below, exposure of children is delayed by 200ms.

```tsx /ms/
import { Delay } from '@suspensive/react'

const Example = () => (
  <Delay ms={200}>
    <Delayed />
  </Delay>
)
```

#### 2. Pass a delayed flag to children

If children is a render prop, it passes a flag instead of controlling the exposure. In the code below, `isDelayed` is passed as true after 200ms.

```tsx /ms/
import { Delay } from '@suspensive/react'

export const Example = () => {
  return (
    <Delay ms={200}>
      {({ isDelayed }) => (
        <div
          style={{
            opacity: isDelayed ? 1 : 0,
            transition: 'opacity 1500ms',
          }}
        ></div>
      )}
    </Delay>
  )
}
```

> **Info:** Delayed loading UI sometimes provides better usability
> 
> ```tsx /Delay/
import { Delay, Suspense } from '@suspensive/react'

const Example = () => (
  <Suspense
    fallback={
      <Delay ms={200}>
        <Skeleton />
      </Delay>
    }
  >
    ...
  </Suspense>
)
```

> **Note:** Default ms
> 
> `<Delay/>` are more powerful when used with `<DefaultPropsProvider/>`. Control multiple `<Delay/>`s default ms with `<DefaultPropsProvider/>`. Details are introduced in [`<DefaultPropsProvider/>` page](/docs/react/DefaultPropsProvider).

### props.fallback

fallback will be shown before the delayed exposure of children.

```jsx /fallback/
import { Delay } from '@suspensive/react'

const Example = () => (
  <Delay ms={200} fallback={<>Fallback Text</>}>
    200ms delayed Text
  </Delay>
)
```

## Delay.with

`Delay.with` is a higher-order component (HOC) that wraps a component using `Delay`.
`Delay.with` makes it easy to wrap a component.

```tsx /Delay.with/
import { Delay } from '@suspensive/react'

const Example = Delay.with({ ms: 2000 }, () => {
  return <>...</>
})
```
