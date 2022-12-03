---
sidebar_position: 3
title: Motivation
---

You may wrap [React's Suspense](https://reactjs.org/docs/react-api.html#reactsuspense), [error-boundary](https://reactjs.org/docs/error-boundaries.html) to use them in your projects. because of below reasons.

## Sometimes, Suspense need to avoid SSR under React 18

If you have used React.Suspense in SSR environment like Next.js, you may encounter error like below.
![Example banner](./../../static/img/suspense-in-ssr-error.png)

It's why [Suspense](https://react.suspensive.org/docs/reference/Suspense) containing CSROnly mode is added in this library.

## ErrorBoundary more simply

[bvaughn/react-error-boundary](https://github.com/bvaughn/react-error-boundary) that provide ErrorBoundary is popular library to use React's error-boundary concept declaratively.
ErrorBoundary of bvaughn/react-error-boundary have fallback props named like FallbackComponent, fallbackRender, fallback.

I want to make ErrorBoundary's interface about fallback more simply like only fallback in ErrorBoundary of @suspensive/react

It's why [ErrorBoundary](https://react.suspensive.org/docs/reference/ErrorBoundary) is added in this library.

## Merging Suspense and ErrorBoundary

If Promise have pending, not only success also failure need to be treated at once easily.
so, I want to make a component wrapping Suspense, ErrorBoundary. also CSROnly mode is required to use this component in SSR environment like Next.js

It's why [AsyncBoundary](https://react.suspensive.org/docs/reference/AsyncBoundary) containing CSROnly mode is added in this library.

## Resetting ErrorBoundary outside of fallback

To reset ErrorBoundary in error boundary, you can use reset in fallback of ErrorBoundary.
but If you want to reset ErrorBoundary outside of its fallback, you can provide new resetKeys to props of ErrorBoundary.

It's why [ResetKey](https://react.suspensive.org/docs/reference/ResetKey) is added in this library.

## Sometimes, HOC is easier than making depths

Wrapping component with hoc is simple than making depth with component.
I want to provide less effort to use react if you want to wrap any component by Suspensive.

It's why [HOC of Boundaries](https://react.suspensive.org/docs/reference/hoc/withSuspense) is added in this library.
