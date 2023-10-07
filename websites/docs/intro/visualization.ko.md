---
sidebar_position: 2
title: 시각화 자료
---

### 각 컴포넌트들이 어떤 일을 하는지 봅시다

1. [`<Suspense/>`](/docs/react/src/Suspense.i18n)에서 다수의 fetch에서 로딩과 성공을 한 번에 선언적으로 처리하는 방법.
2. [`<ErrorBoundary/>`](/docs/react/src/ErrorBoundary.i18n)에서 실패를 한 번에 선언적으로 처리하는 방법과 스스로를 reset하는 방법. 그리고 resetKeys가 하는 일.
3. [`<ErrorBoundaryGroup/>`](/docs/react/src/ErrorBoundaryGroup.i18n)이 resetKeys를 사용하지 않고 다수의 `<ErrorBoundary/>`를 쉽게 재설정하는 방법.
4. [`<AsyncBoundary/>`](/docs/react/src/AsyncBoundary.i18n)에서 로딩, 성공 혹은 실패를 한 번에 처리하는 방법.

:::info

Suspensive(`<Suspense/>`, `<ErrorBoundary/>`, `<ErrorBoundaryGroup/>`, `<AsyncBoundary/>`)의 핵심 개념을 누구나 시각적으로 이해할 수 있도록 [시각화 자료](https://visualization.suspensive.org/react)를 만들었습니다. 지금 바로 이 사이트에 들어갈 수 있습니다.

[**시각화자료를 보려면 클릭하기**](https://visualization.suspensive.org/react)

:::

<iframe
  src="https://visualization.suspensive.org/react"
  title="@suspensive/react"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  style={{
    width: '100%',
    height: '75vh',
    border: '0',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'static',
    zIndex: 0,
  }}
></iframe>
