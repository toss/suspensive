# @suspensive/react

@suspensive/react는 React Suspense를 쉽고 효과적으로 사용하기 위한 모든 필수 컴포넌트와 훅을 제공합니다.

[![npm version](https://img.shields.io/npm/v/@suspensive/react?color=000&labelColor=000&logo=npm&label=)](https://www.npmjs.com/package/@suspensive/react)
[![npm](https://img.shields.io/npm/dm/@suspensive/react?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/react)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@suspensive/react?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/react)

## 설치하기

@suspensive/react는 npm에 있습니다. 최신 안정버전을 설치하기 위해 아래 커맨드를 실행하세요

```shell npm2yarn
npm install @suspensive/react
```

## 특징

- 🚀 **쉬운 Suspense**: React Suspense로 선언적 로딩 상태 구현
- 🛡️ **에러 바운더리**: 내장된 에러 처리 컴포넌트
- 🎯 **타입 안전**: 뛰어난 타입 추론을 제공하는 완전한 TypeScript 지원
- 🔄 **Async/Await**: Suspense와 함께하는 더 나은 async/await 지원
- ⚡ **성능**: 프로덕션 사용에 최적화
- 🧪 **잘 테스트됨**: 포괄적인 테스트 커버리지

## 빠른 시작

```jsx
import { Suspense, ErrorBoundary, Async } from '@suspensive/react'

function App() {
  return (
    <ErrorBoundary
      fallback={({ error, reset }) => (
        <div>
          <h2>문제가 발생했습니다:</h2>
          <details>{error.message}</details>
          <button onClick={reset}>다시 시도</button>
        </div>
      )}
    >
      <Suspense fallback={<div>로딩 중...</div>}>
        <AsyncComponent />
      </Suspense>
    </ErrorBoundary>
  )
}

// async/await 패턴을 위한 Async 사용
function AsyncComponent() {
  return (
    <Async>
      {async () => {
        const data = await fetchData()
        return <div>{data.message}</div>
      }}
    </Async>
  )
}
```

## 핵심 컴포넌트

### Suspense

향상된 개발자 경험을 제공하는 Suspense 컴포넌트.

### ErrorBoundary

React 컴포넌트를 위한 선언적 에러 바운더리.

### Async

Suspense와 함께 비동기 작업을 처리하는 컴포넌트.

### Delay

로딩 상태의 깜빡임을 방지하기 위한 지연 추가.

## 문서

포괄적인 가이드, API 참조 및 예제는 [suspensive.org](https://suspensive.org)를 방문하세요.

## 라이센스

MIT © [Viva Republica, Inc.](https://github.com/toss/suspensive/blob/main/LICENSE)
