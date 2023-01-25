---
sidebar_position: 2
title: ErrorBoundary
---

이 컴포넌트는 간단하고 재사용가능하게 다른 컴포넌트들을 감싸서 감싼 컴포넌트의 렌더링 중 어떠한 에러가 발생하면 처리할 수 있습니다.

![Example banner](/gif/errorboundary-example.gif)

## fallback

자식에 오류가 발생하면 ErrorBoundary가 오류를 포착한 fallback이 렌더링됩니다.

```tsx
const Example = () => (
  <ErrorBoundary fallback={({ error, reset }) => <button onClick={reset}>{JSON.stringify(error)}</button>}>
    <ErrorAfter4s />
  </ErrorBoundary>
)

const ErrorAfter4s = () => {
  const [asyncState, setAsyncState] = useState<{ isError: true; error: Error } | { isError: false; error: null }>({
    isError: false,
    error: null,
  })

  useEffect(() => {
    setTimeout(() => {
      setAsyncState({ isError: true, error: { status: 401, message: 'unauthorized' } })
    }, 4000)
  }, [])

  if (asyncState.isError) {
    throw asyncState.error
  }

  return <>No error</>
}
```

## resetKeys: unknown[]

ErrorBoundary의 fallback 외부에 있는 컴포넌트가 ErrorBoundary를 reset하려면 resetKeys배열에 resetKey를 할당하면 됩니다. resetKeys는 배열의 하나 이상의 요소가 변경된 경우에만 작동합니다. useEffect의 종속성 배열이 작동하는 방식과 같이 resetKeys로 매 렌더링마다 새 배열을 주입하는 것을 걱정할 필요도 없습니다.

```tsx
const Example = () => {
  const [resetKey, setResetKey] = useState(0)

  const resetOutside = () => setResetKey((prev) => prev + 1)

  return (
    <>
      <button onClick={resetOutside} />
      <ErrorBoundary resetKeys={[resetKey]}>
        <ErrorAfter4s />
      </ErrorBoundary>
    </>
  )
}
```
