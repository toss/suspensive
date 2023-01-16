---
sidebar_position: 1
title: Suspense
---

이 컴포넌트는 단지 [Next.js](https://nextjs.org)와 같은 서버 측 렌더링 환경에서 Suspense를 쉽게 사용하기 위한 [React's Suspense](https://reactjs.org/docs/react-api.html#reactsuspense)를 래핑하는 것입니다. 

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
