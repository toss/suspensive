# @suspensive/jotai

@suspensive/jotai는 Jotai 상태 관리 라이브러리를 기반으로 하여, React Suspense와 원활하게 작동하는 기능들을 추가로 제공합니다. 이 라이브러리는 atom을 사용한 상태 관리를 지원하며, Suspense 기반의 워크플로우에 쉽게 통합할 수 있는 유틸리티들을 제공합니다.

[![npm version](https://img.shields.io/npm/v/@suspensive/jotai?color=000&labelColor=000&logo=npm&label=)](https://www.npmjs.com/package/@suspensive/jotai) [![npm](https://img.shields.io/npm/dm/@suspensive/jotai?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/jotai) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/@suspensive/jotai?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/jotai)

## 설치하기

@suspensive/jotai는 npm에 있습니다. 최신 안정버전을 설치하기 위해 아래 커맨드를 실행하세요

```shell npm2yarn
npm install @suspensive/jotai jotai
```

## 특징

- ⚛️ **Jotai 통합**: Suspense 지원을 포함한 향상된 atom 기반 상태 관리
- 🚀 **Suspense 지원**: React Suspense 패턴에 대한 내장 지원
- 🎯 **타입 안전**: 뛰어난 타입 추론을 제공하는 완전한 TypeScript 지원
- 🔄 **비동기 Atom**: 원활한 비동기 상태 관리
- ⚡ **성능**: 최소한의 리렌더링에 최적화
- 🧪 **잘 테스트됨**: 포괄적인 테스트 커버리지

## 빠른 시작

```jsx
import { Suspense } from 'react'
import { atom, useAtom } from 'jotai'
import { atomWithSuspenseQuery } from '@suspensive/jotai'

// suspense가 포함된 비동기 atom 생성
const userAtom = atomWithSuspenseQuery(() => ({
  queryKey: ['user'],
  queryFn: async () => {
    const response = await fetch('/api/user')
    return response.json()
  },
}))

function UserProfile() {
  const [user] = useAtom(userAtom)
  return <div>안녕하세요, {user.name}님!</div>
}

function App() {
  return (
    <Suspense fallback={<div>사용자 정보 로딩 중...</div>}>
      <UserProfile />
    </Suspense>
  )
}
```

## 핵심 기능

### atomWithSuspenseQuery

TanStack Query와 통합되고 Suspense를 지원하는 atom을 생성합니다.

### 비동기 상태 관리

자동 Suspense 통합으로 비동기 상태를 처리합니다.

### 타입 안전성

모든 atom 작업과 상태 관리에 대한 완전한 TypeScript 지원.

## 문서

포괄적인 가이드, API 참조 및 예제는 [suspensive.org](https://suspensive.org)를 방문하세요.

## 라이센스

MIT © [Viva Republica, Inc.](https://github.com/toss/suspensive/blob/main/LICENSE)
