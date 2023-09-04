---
sidebar_position: 1
title: Motivation
---

You may wrap [React's Suspense](https://reactjs.org/docs/react-api.html#reactsuspense), [error-boundary](https://reactjs.org/docs/error-boundaries.html) to use them in your projects. because of below reasons.

### 1. Sometimes, Suspense need to avoid SSR under React 18

If you have used React.Suspense in SSR environment like Next.js, you may encounter error like below.
![Example banner](/img/suspense-in-ssr-error.png)

It's why [Suspense](/docs/react/src/Suspense.i18n) containing CSROnly mode is added in this library.

### 2. ErrorBoundary more simply

[bvaughn/react-error-boundary](https://github.com/bvaughn/react-error-boundary) that provide ErrorBoundary is popular library to use React's error-boundary concept declaratively.
ErrorBoundary of bvaughn/react-error-boundary have fallback props named like FallbackComponent, fallbackRender, fallback.

I want to make ErrorBoundary's interface about fallback more simply like only fallback in ErrorBoundary of @suspensive/react

It's why [ErrorBoundary](/docs/react/src/ErrorBoundary.i18n) is added in this library.

### 3. Resetting ErrorBoundaries outside of fallback

To reset ErrorBoundary, you can use reset, fallback prop of ErrorBoundary.
but If you want to reset multiple ErrorBoundaries outside of its fallback, you have to provide new element of resetKeys to props of each ErrorBoundaries. but If you use ErrorBoundaryGroup, You don't need to do this tiresome. ErrorBoundaryGroup will reset multiple ErrorBoundary easily.

It's why [ErrorBoundaryGroup](/docs/react/src/ErrorBoundaryGroup.i18n) is added in this library.
