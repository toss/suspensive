---
sidebar_position: 1
title: Suspense
---

이 컴포넌트는 단지 [Next.js](https://nextjs.org)와 같은 서버 측 렌더링 환경에서 쉽게 [React Suspense](https://reactjs.org/docs/react-api.html#reactsuspense)를 사용하기 위해 만들어졌습니다.

### Default 모드

기본적으로 @suspensive/react의 Suspense는 React의 Suspense가 됩니다.

```tsx
// @suspensive/react의 Suspense는 단지 React.Suspense입니다.
const DefaultMode = () => (
  <Suspense fallback={<Loading />}>
    <Children />
  </Suspense>
)
```

### CSROnly 모드

CSROnly 모드를 사용하면 Suspense는 fallback을 먼저 return하고 컴포넌트가 마운트된 후, 클라이언트 사이드에서만 children이 return됩니다. 하지만 서버 사이드에서는 fallback만이 return됩니다.

```tsx
// 오직 클라이언트 사이드 렌더링에서만 children을 노출합니다.
const CSROnlyMode = () => (
  <Suspense.CSROnly fallback={<Loading />}>
    <Children />
  </Suspense.CSROnly>
)
```

#### SSR을 지원하도록 점진적으로 마이그레이션하기 (Suspense.CSROnly -> default Suspense)

React.Suspense를 SSR과 CSR에서 모두 사용하고 싶다면 Suspense.CSROnly에서 Default Suspense로 점진적으로 마이그레이션하면 쉽게 적용할 수 있습니다.
