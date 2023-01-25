---
sidebar_position: 4
title: AsyncBoundary
---

AsyncBoundary는 @suspensive/react의 [Suspense](/docs/react/src/Suspense.i18n)와 [ErrorBoundary](/docs/react/src/ErrorBoundary.i18n)를 쉽게 한번에 사용하기 위해 래핑한 컴포넌트입니다.

### Default 모드

기본 AsyncBoundary는 default Suspense와 ErrorBoundary를 return합니다.

```tsx
const AsyncBoundaryDefault = () => (
  <AsyncBoundary
    pendingFallback={<Loading />}
    rejectedFallback={({ reset, error }) => <button onClick={reset}>{JSON.stringify(error)}</button>}
    onReset={() => console.log('ErrorBoundary in AsyncBoundary has reset')} // ex) reset react-query cache on ErrorBoundary reset.
    onError={(error, info) => alert(JSON.stringify(error))}
  >
    <Children />
  </AsyncBoundary>
)
```

### CSROnly 모드

하지만 CSROnly모드를 사용하면, AsyncBoundary.CSROnly는 ErrorBoundary와 default Suspense가 아닌 Suspense.CSROnly를 return합니다. 
서버에서는 Suspense.CSROnly는 fallback만을 return합니다. 그래서 AsyncBoundary.CSROnly는 서버에서 pendingFallback만을 return하게 됩니다.

```tsx
/** 먼저, AsyncBoundary.CSROnly는 pendingFallback을 return합니다. 클라이언트 사이드에서는 마운트 후, children을 return합니다.
하지만 children에 error가 있다면, AsyncBoundary는 이 thrown error를 잡고 rejectedFallback가 render됩니다. */

const AsyncBoundaryAvoidSSR = () => (
  <AsyncBoundary.CSROnly
    pendingFallback={<Loading />}
    rejectedFallback={({ reset, error }) => <button onClick={reset}>{JSON.stringify(error)}</button>}
    onReset={() => console.log('ErrorBoundary in AsyncBoundary has reset')} // ex) ErrorBoundary reset할 때, onReset이 호출되고 react-query cache를 reset할 수 있습니다.
    onError={(error, info) => alert(JSON.stringify(error))}
  >
    <Children />
  </AsyncBoundary.CSROnly>
)
```

#### SSR 지원하도록 점진적으로 마이그레이션하기 (AsyncBoundary.CSROnly -> default AsyncBoundary)

default AsyncBoundary를 SSR/CSR에서 모두 사용하고 싶다면, AsyncBoundary.CSROnly를 먼저 사용하고 default AsyncBoundary로 점진적으로 변경하면 됩니다.

