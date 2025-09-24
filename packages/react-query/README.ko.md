# @suspensive/react-query

@suspensive/react-query는 @tanstack/react-query의 suspense 기능을 쉽고 효과적으로 사용할 수 있도록 하는 컴포넌트와 훅을 제공하며, v4와 v5 모두를 지원하여 자동 버전 감지 기능을 제공합니다.

[![npm version](https://img.shields.io/npm/v/@suspensive/react-query?color=000&labelColor=000&logo=npm&label=)](https://www.npmjs.com/package/@suspensive/react-query)
[![npm](https://img.shields.io/npm/dm/@suspensive/react-query?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/react-query)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@suspensive/react-query?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/react-query)

## 설치하기

@suspensive/react-query는 npm에 있습니다.

2.2.0 버전 이후로는 @tanstack/react-query의 v4와 v5를 모두 지원합니다. package.json의 dependencies에 @tanstack/react-query의 버전에 따라 자동으로 알맞은 @suspensive/react-query 버전을 사용하게 됩니다.

@suspensive/react-query는 npm에 있습니다. 최신 안정 버전을 설치하기 위해 아래 커맨드를 실행하세요

```shell
npm install @suspensive/react-query @tanstack/react-query
```

@tanstack/react-query v4는 @tanstack/react-query v5 보다 [더 낮은 버전의 브라우저](https://suspensive.org/ko/docs/react-query/motivation#tanstackreact-query-v5%EC%9D%98-es-private-field%EB%A1%9C-%EC%9D%B8%ED%95%B4-%EC%A0%80%EB%B2%84%EC%A0%84%EC%9D%98-%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80%EB%A5%BC-%EC%A7%80%EC%9B%90%ED%95%98%EC%A7%80-%EB%AA%BB%ED%95%98%EB%8A%94-%EB%AC%B8%EC%A0%9C%EB%A5%BC-%ED%95%B4%EA%B2%B0%ED%95%A9%EB%8B%88%EB%8B%A4)를 지원합니다.  
@tanstack/react-query v4를 사용하고자 하면 아래 커맨드를 실행하세요.

```shell
npm install @suspensive/react-query @tanstack/react-query@4
```

## 특징

- 🔄 **이중 버전 지원**: TanStack Query v4와 v5에서 자동으로 작동
- 🚀 **Suspense 통합**: 데이터 페칭을 위한 향상된 React Suspense 지원
- 🎯 **타입 안전**: 뛰어난 타입 추론을 제공하는 완전한 TypeScript 지원
- 🛡️ **에러 처리**: 내장된 에러 바운더리 통합
- ⚡ **성능**: 프로덕션 사용에 최적화
- 🌐 **브라우저 지원**: v4는 구형 브라우저와 호환

## 빠른 시작

```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSuspenseQuery, useSuspenseInfiniteQuery } from '@suspensive/react-query'
import { Suspense, ErrorBoundary } from '@suspensive/react'

const queryClient = new QueryClient()

function UserProfile({ userId }) {
  const { data: user } = useSuspenseQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  })

  return <div>안녕하세요, {user.name}님!</div>
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
          <UserProfile userId={1} />
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  )
}
```

## 핵심 훅

### useSuspenseQuery

내장 Suspense 지원을 제공하는 향상된 `useQuery`.

### useSuspenseQueries

병렬 쿼리를 위한 `useQueries`의 Suspense 버전.

### useSuspenseInfiniteQuery

내장 Suspense 지원을 제공하는 향상된 `useInfiniteQuery`.

### 쿼리 옵션

- `queryOptions` - 타입 안전한 쿼리 옵션 빌더
- `infiniteQueryOptions` - 타입 안전한 무한 쿼리 옵션 빌더
- `mutationOptions` - 타입 안전한 뮤테이션 옵션 빌더

## 커뮤니티 리소스

이 라이브러리는 현재 [TanStack Query의 커뮤니티 리소스](https://tanstack.com/query/latest/docs/framework/react/community/suspensive-react-query)로, 공식 지원과 문서를 제공합니다.

## 문서

포괄적인 가이드, API 참조 및 예제는 [suspensive.org](https://suspensive.org)를 방문하세요.

## 라이센스

MIT © [Viva Republica, Inc.](https://github.com/toss/suspensive/blob/main/LICENSE)
