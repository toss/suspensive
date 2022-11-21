---
sidebar_position: 1
title: Suspense
---

This component is just wrapping [React's Suspense](https://reactjs.org/docs/react-api.html#reactsuspense). to use Suspense easily in Server-side rendering environment like [Next.js](https://nextjs.org)


## Props
Same with React.SuspenseProps

```ts
interface SuspenseProps {
        children?: ReactNode | undefined;

        /** A fallback react tree to show when a Suspense child (like React.lazy) suspends */
        fallback?: ReactNode;
    }
```

## Examples

### Suspense

Suspense of @suspensive/react-boundary will be just Suspense of original React.

```tsx
// Suspense of @suspensive/react-boundary is just React.Suspense
const SuspenseDefault = () => {
    return <Suspense fallback={<Loading/>}>
        <Children/>
    </Suspense>
}
```

### Suspense.CSROnly

But if you turn on CSROnly, Suspense.CSROnly will return fallback first. After mount, return children of Suspense.CSROnly only in client.
In server, Suspense.CSROnly return fallback only.
If you want to use React.Suspense working in both SSR/CSR, You can change Suspense.CSROnly to Suspense gradually.

```tsx
// Turn on CSROnly to avoid AvoidSSR
// This will try to expose children in only client-side rendering
const SuspenseAvoidSSR = () => {
    return <Suspense.CSROnly fallback={<Loading/>}>
        <Children/>
    </Suspense>
}
```

#### Migration support SSR gradually (Susepense.CSROnly -> default Suspense)
If you want to use default Suspense working in both SSR/CSR, You can change Suspense.CSROnly to default Suspense gradually.
