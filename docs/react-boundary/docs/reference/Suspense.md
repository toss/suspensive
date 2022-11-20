---
sidebar_position: 1
title: Suspense (SSRSafe)
---

This component is just wrapping [React's Suspense](https://reactjs.org/docs/react-api.html#reactsuspense). that make developers can use Suspense easily in SSR(Server-side rendering) environment like [Next.js](https://nextjs.org)

## Props

```ts
type Props = React.SuspenseProps & {
    ssrSafe?: boolean | undefined; // defaultValue: false
}
```

## Example

### in Client-side rendering

Suspense of @suspensive/react-boundary will be just Suspense of original React

```tsx
// Default ssrSafe is off
const CSR = () => {
    return <Suspense fallback={<Loading/>}>
        <Children/>
    </Suspense>
}
```

```tsx
// Turn off ssrSafe
const CSR = () => {
    return <Suspense ssrSafe={false} fallback={<Loading/>}>
        <Children/>
    </Suspense>
}
```

```tsx
// Suspense.CSROnly is React.Suspense
const CSR = () => {
    return <Suspense.CSROnly fallback={<Loading/>}>
        <Children/>
    </Suspense>
}
```

### in Server-side rendering

but if you turn on ssrSafe, Suspense of @suspensive/react-boundary will return children after mount only in client. but in server, return only fallback.

this ssrSafe mode can make Suspense work in SSR framework like Next.js

```tsx
// Turn on ssrSafe
const SSR = () => {
    return <Suspense ssrSafe fallback={<Loading/>}>
        <Children/>
    </Suspense>
}
```

```tsx
// Suspense.SSRSafe will try to expose children in only client-side rendering
const SSR = () => {
    return <Suspense.SSRSafe fallback={<Loading/>}>
        <Children/>
    </Suspense>
}
```
