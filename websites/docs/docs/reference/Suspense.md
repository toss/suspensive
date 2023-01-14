---
sidebar_position: 1
title: Suspense
---

This component is just wrapping [React's Suspense](https://reactjs.org/docs/react-api.html#reactsuspense). to use Suspense easily in Server-side rendering environment like [Next.js](https://nextjs.org)

### Default mode

Default Suspense will be just Suspense of original React.

```tsx
// Suspense is just React.Suspense
const DefaultMode = () => (
  <Suspense fallback={<Loading />}>
    <Children />
  </Suspense>
)
```

### CSROnly mode

But if you turn on CSROnly mode, Suspense will return fallback first. After mount, return children only in client. but in server, return fallback only.
If you want to use React.Suspense working in both SSR / CSR, You can change Suspense.CSROnly to Suspense gradually.

```tsx
// This will expose children in client-side rendering only.
const CSROnlyMode = () => (
  <Suspense.CSROnly fallback={<Loading />}>
    <Children />
  </Suspense.CSROnly>
)
```

#### Migration support SSR gradually (Susepense.CSROnly -> default Suspense)

If you want to use default Suspense working in both SSR/CSR, You can change Suspense.CSROnly to default Suspense gradually.
