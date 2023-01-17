---
sidebar_position: 1
title: 동기
---

React의 [Suspense](https://reactjs.org/docs/react-api.html#reactsuspense)와 [Error Boundary](https://reactjs.org/docs/error-boundaries.html)를 프로젝트에서 사용하기 위해서 이 개념들을 아래와 같은 이유들로 wrapping하게 될 것입니다.

### 1. Suspense는 React 18버전 이하에서 SSR(Server-side rendering)을 피할 필요가 있습니다.

React.Suspense를 Next.js와 같은 서버사이드 렌더링 환경에서 사용해본 적이 있다면 아마 아래 사진과 같은 에러를 겪게 된적이 있을 겁니다.
![Example banner](/img/suspense-in-ssr-error.png)

이것이 CSROnly모드가 있는 [Suspense](/docs/react/src/Suspense.i18n)를 이 라이브러리에 추가한 이유입니다.

### 2. ErrorBoundary를 더욱 단순하게 사용하고 싶습니다.

[bvaughn/react-error-boundary](https://github.com/bvaughn/react-error-boundary)는 React의 Error Boundary개념을 선언적으로 제공하는 가장 인기있는 라이브러리입니다.
bvaughn/react-error-boundary의 ErrorBoundary는 fallback prop을 위해 FallbackComponent, fallbackRender, fallback와 같은 다양한 이름으로 이를 제공합니다.

하지만 ErrorBoundary fallback의 interface를 @suspensive/react의 ErrorBoundary와 같이 더 단순하게 사용하고 싶었습니다.

이것이 [ErrorBoundary](/docs/react/src/ErrorBoundary.i18n)를 이 라이브러리에 추가한 이유입니다.

### 3. Suspense와 ErrorBoundary를 합치고 싶습니다.

Promise가 Pending 상태이면 성공뿐만 아니라 실패도 한번에 쉽게 처리할 수 있어야 합니다.
그래서 Suspense, ErrorBoundary를 래핑하는 컴포넌트를 만들고 싶어집니다. 또한 Next.js와 같은 SSR 환경에서 이 구성 요소를 사용하려면 CSROnly 모드가 필요합니다.

이것이 CSROnly모드가 있는 [AsyncBoundary](/docs/react/src/AsyncBoundary.i18n)를 이 라이브러리에 추가한 이유입니다.

### 4. ErrorBoundary.fallback의 외부에서 다수의 ErrorBoundary를 reset하고 싶습니다.

ErrorBoundary를 reset하려면 ErrorBoundary.fallback 렌더링 시에 주어지는 props의 reset을 사용하면 됩니다.

그러나 fallback 외부에서 다수의 ErrorBoundary을 reset하려면 각 ErrorBoundary의 props인 resetKeys에 새 resetKey를 제공해야 합니다. 하지만 ErrorBoundaryGroup을 사용하면 이렇게 번거롭게 reset할 필요가 없습니다. ErrorBoundaryGroup은 여러 ErrorBoundary를 쉽게 재설정합니다.

이것이 [ErrorBoundaryGroup](/docs/react/src/ErrorBoundaryGroup.i18n)를 이 라이브러리에 추가한 이유입니다.
