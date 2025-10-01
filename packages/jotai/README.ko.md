# @suspensive/jotai

@suspensive/jotai는 Jotai 상태 관리 라이브러리를 기반으로 하여, React Suspense와 원활하게 작동하는 기능들을 추가로 제공합니다. 이 라이브러리는 atom을 사용한 상태 관리를 지원하며, Suspense 기반의 워크플로우에 쉽게 통합할 수 있는 유틸리티들을 제공합니다.

[![npm version](https://img.shields.io/npm/v/@suspensive/jotai?color=000&labelColor=000&logo=npm&label=)](https://www.npmjs.com/package/@suspensive/jotai) [![npm](https://img.shields.io/npm/dm/@suspensive/jotai?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/jotai) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/@suspensive/jotai?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/jotai)

## 설치하기

@suspensive/jotai는 npm에 있습니다. 최신 안정버전을 설치하기 위해 아래 커맨드를 실행하세요

```shell
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
import { Atom } from '@suspensive/jotai'
import { Suspense } from '@suspensive/react'
import { atom } from 'jotai'

// 비동기 atom 생성
const userAtom = atom(async () => {
  const response = await fetch('/api/user')
  return response.json()
})

function App() {
  return (
    <Suspense fallback={<div>사용자 정보 로딩 중...</div>}>
      <Atom atom={userAtom}>{([user]) => <div>안녕하세요, {user.name}님!</div>}</Atom>
    </Suspense>
  )
}
```

## 핵심 컴포넌트

### Atom

비동기 atom에 대한 자동 Suspense 지원과 함께 Jotai atom을 사용하기 위한 선언적 인터페이스.

### AtomValue

Jotai의 useAtomValue와 유사하지만 컴포넌트로 제공되는 atom 값의 읽기 전용 인터페이스.

### SetAtom

atom을 업데이트하기 위한 쓰기 전용 인터페이스로, atom setter에 접근하는 선언적 방법을 제공.

### 타입 안전성

모든 atom 작업과 상태 관리에 대한 완전한 TypeScript 지원.

## 문서

포괄적인 가이드, API 참조 및 예제는 [suspensive.org](https://suspensive.org)를 방문하세요.

## 라이센스

MIT © [Viva Republica, Inc.](https://github.com/toss/suspensive/blob/main/LICENSE)
