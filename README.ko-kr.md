<div align="center">
  <a href="https://suspensive.org" title="Suspensive Libraries - TypeScript/JavaScript packages to use React Suspense easily">
    <img src="https://github.com/toss/suspensive/blob/main/assets/logo_background_star.png?raw=true" alt="Suspensive Libraries Logo - TypeScript/JavaScript packages to use React Suspense easily." width="600" />
    <h1 align="center">Suspensive</h1>
  </a>
</div>

<div align="center">

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge&color=000&labelColor=000)](https://github.com/toss/suspensive/blob/main/LICENSE)
[![@suspensive/react downloads](https://img.shields.io/npm/dt/@suspensive/react.svg?label=@suspensive/react&color=000&labelColor=000&style=for-the-badge)](https://www.npmjs.com/package/@suspensive/react)
[![@suspensive/react-query downloads](https://img.shields.io/npm/dt/@suspensive/react-query.svg?label=@suspensive/react-query&color=000&labelColor=000&style=for-the-badge)](https://www.npmjs.com/package/@suspensive/react-query)

[![codecov](https://codecov.io/gh/toss/suspensive/graph/badge.svg?token=5PopssACmx)](https://codecov.io/gh/toss/suspensive) [![CodSpeed Badge](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://codspeed.io/toss/suspensive) ![GitHub stars](https://img.shields.io/github/stars/toss/suspensive?style=social) ![GitHub forks](https://img.shields.io/github/forks/toss/suspensive?style=social)

[공식 문서](https://suspensive.org) | [시각화](https://visualization.suspensive.org) | [종속성 그래프](https://graph.suspensive.org)

</div>

<br/>
<br/>

## [@suspensive/react](https://suspensive.org/docs/react/installation)

[![npm version](https://img.shields.io/npm/v/@suspensive/react?color=000&labelColor=000&logo=npm&label=)](https://www.npmjs.com/package/@suspensive/react)
[![npm](https://img.shields.io/npm/dm/@suspensive/react?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/react)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@suspensive/react?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/react)

CSR, SSR에서 선언적으로 사용할 수 있는 컴포넌트를 제공해요.

### 주요 기능

- Suspense
- ErrorBoundary, ErrorBoundary.Consumer useErrorBoundary, useErrorBoundaryFallbackProps
- ErrorBoundaryGroup, ErrorBoundaryGroup.Consumer useErrorBoundaryGroup
- Delay
- Suspensive, SuspensiveProvider
- DevMode
- wrap

### 설치 방법

```shell
npm install @suspensive/react
```

```shell
pnpm add @suspensive/react
```

```shell
yarn add @suspensive/react
```

### 사용 예시

```tsx
import { Suspense, ErrorBoundary, ErrorBoundaryGroup, Delay } from '@suspensive/react'

const Example = () => (
  <ErrorBoundaryGroup>
    <ErrorBoundaryGroup.Consumer>
      {(group) => <button onClick={group.reset}>Reset All</button>}
    </ErrorBoundaryGroup.Consumer>
    <ErrorBoundary fallback={(props) => <button onClick={props.reset}>Reset error: {props.error.message}</button>}>
      <Suspense
        fallback={
          <Delay ms={200}>
            <Spinner />
          </Delay>
        }
      >
        <SuspenseMaker />
      </Suspense>
    </ErrorBoundary>
  </ErrorBoundaryGroup>
)
```

<br/>
<br/>

## [@suspensive/react-query](https://suspensive.org/docs/react-query/installation)

[![npm version](https://img.shields.io/npm/v/@suspensive/react-query?color=000&labelColor=000&logo=npm&label=)](https://www.npmjs.com/package/@suspensive/react-query)
[![npm](https://img.shields.io/npm/dm/@suspensive/react-query?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/react-query)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@suspensive/react-query?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/react-query)

[@tanstack/react-query with suspense](https://tanstack.com/query/v4/docs/framework/react/guides/suspense)의 API를 제공해요.

### 주요 기능

- useSuspenseQuery, useSuspenseQueries, useSuspenseInfiniteQuery
- SuspenseQuery, SuspenseQueries, SuspenseInfiniteQuery
- QueryErrorBoundary
- queryOptions

### 설치 방법

```shell
npm install @suspensive/react-query @tanstack/react-query
```

```shell
pnpm add @suspensive/react-query @tanstack/react-query
```

```shell
yarn add @suspensive/react-query @tanstack/react-query
```

### 사용 예시

```tsx
import { Suspense } from '@suspensive/react'
import { QueryErrorBoundary, useSuspenseQuery, SuspenseQuery, queryOptions } from '@suspensive/react-query'

const customQuery = () =>
  queryOptions({
    queryKey: ['queryKey'],
    queryFn: () => Promise.resolve({ text: 'Hello Suspensive' }),
  })

const SuspenseMaker = () => {
  const query = useSuspenseQuery(customQuery())
  return <>{query.data}</>
}

const Example = () => (
  <QueryErrorBoundary fallback={(props) => <button onClick={props.reset}>Reset error: {props.error.message}</button>}>
    <Suspense fallback={<Spinner />}>
      <SuspenseMaker />
    </Suspense>
    <Suspense fallback={<Spinner />}>
      <SuspenseQuery {...customQuery()} select={({ text }) => text}>
        {({ data: text }) => <>{text}</>}
      </SuspenseQuery>
    </Suspense>
  </QueryErrorBoundary>
)
```

<br/>

## 문서 [![deployment](https://img.shields.io/github/deployments/toss/suspensive/Production%20%E2%80%93%20suspensive.org?label=vercel&logo=vercel&logoColor=white&color=000&labelColor=000)](https://suspensive.org)

공식 문서를 제공합니다.

[OFFICIAL DOCS](https://suspensive.org) 사이트를 방문하세요.

<br/>

## 시각화 [![deployment](https://img.shields.io/github/deployments/toss/suspensive/Production%20%E2%80%93%20visualization.suspensive.org?label=vercel&logo=vercel&logoColor=white&color=000&labelColor=000)](https://visualization.suspensive.org)

Suspensive의 핵심 개념을 시각적으로 확인할 수 있습니다.

[VISUALIZATION](https://visualization.suspensive.org) 사이트를 방문하세요.

<br/>

## 기여하기

기여 가이드를 읽어보시면 Suspensive의 개발 프로세스를 익힐 수 있고, 버그 수정 및 개선 사항을 제안하는 방법, 그리고 변경 사항을 빌드하고 테스트하는 단계에 대해 확인 할 수 있어요.

### 기여자

[![contributors](https://contrib.rocks/image?repo=toss/suspensive)](https://github.com/toss/suspensive/graphs/contributors)

<br/>

## 라이선스

MIT © Viva Republica, Inc. [LICENSE](./LICENSE) 파일을 참고하세요.

<a title="Toss" href="https://toss.im">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://static.toss.im/logos/png/4x/logo-toss-reverse.png">
    <img alt="Toss" src="https://static.toss.im/logos/png/4x/logo-toss.png" width="100">
  </picture>
</a>
