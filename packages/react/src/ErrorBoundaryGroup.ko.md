---
sidebar_position: 3
title: ErrorBoundaryGroup
---

다수의 ErrorBoundary들을 한 번에 관리하기 위한 컴포넌트입니다.

ErrorBoundaryGroup을 사용하면 다수의 ErrorBoundary의 resetKeys에 일일이 resetKey상태를 연결해주지 않아도 ErrorBoundaryGroup의 children으로 있다면 ErrorBoundary들을 쉽게 한 번에 reset할 수 있습니다.

### ErrorBoundaryGroup.Reset

ErrorBoundaryGroup의 children으로 다수의 ErrorBoundary가 있다면 ErrorBoundaryGroup.Reset으로 한번에 reset할 수 있습니다.

```tsx
const Example = () => (
  <ErrorBoundaryGroup>
    <ErrorBoundaryGroup.Reset trigger={(group) => <button onClick={group.reset}>Reset Children</button>} />
    <ErrorBoundary />
    <AsyncBoundary /* AsyncBoundary 또한 ErrorBoundary를 래핑한 컴포넌트이므로 reset됩니다. */ />
  </ErrorBoundaryGroup>
)
```

### withErrorBoundaryGroup, useErrorBoundaryGroup

만약 HOC(Higher Order Component)와 hook을 사용하고 싶다면 withErrorBoundaryGroup, useErrorBoundaryGroup를 사용하세요.

```tsx
const Example = withErrorBoundaryGroup(() => {
  const group = useErrorBoundaryGroup()

  return (
    <>
      <button onClick={group.reset}>Reset All</button>
      <ErrorBoundary />
      <AsyncBoundary />
    </>
  )
})
```

### Nested ErrorBoundaryGroup

중첩된 ErrorBoundaryGroup의 children인 ErrorBoundary는 상위 ErrorBoundaryGroup.Reset으로도 reset됩니다. 하지만 하위 ErrorBoundaryGroup.Reset은 오직 하위 ErrorBoundaryGroup 자신의 children의 ErrorBoundary만을 reset합니다.

```tsx
const Example = () => (
  <ErrorBoundaryGroup>
    <ErrorBoundaryGroup.Reset /* 모든 children을 reset합니다 */ />
    <ErrorBoundary />
    <AsyncBoundary />
    <ErrorBoundaryGroup>
      <ErrorBoundaryGroup.Reset /* 모든 children을 reset합니다 */ />
      <ErrorBoundary />
      <AsyncBoundary />
    </ErrorBoundaryGroup>
  </ErrorBoundaryGroup>
)
```

### blockOutside: boolean

만약 상위 ErrorBoundaryGroup에 의한 하위 ErrorBoundaryGroup의 reset을 막고 싶다면 blockOutside을 사용하면 됩니다.

```tsx
const Example = () => (
  <ErrorBoundaryGroup>
    <ErrorBoundaryGroup.Reset />
    <ErrorBoundary />
    <AsyncBoundary />
    <ErrorBoundaryGroup blockOutside /* 상위 ErrorBoundaryGroup에 의한 reset을 막습니다 */>
      <ErrorBoundaryGroup.Reset />
      <ErrorBoundary />
      <AsyncBoundary />
    </ErrorBoundaryGroup>
  </ErrorBoundaryGroup>
)
```
