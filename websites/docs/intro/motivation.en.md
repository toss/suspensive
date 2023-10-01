---
sidebar_position: 1
title: Motivation
---

### 1. React Suspense need to avoid Server side rendering sometimes

If you have used React Suspense in SSR environment like Next.js, you may encounter error like below.
![Example banner](/img/suspense-in-ssr-error.png)

It's why [`<Suspense/>` and `<Suspense.CSROnly/>`](/docs/react/src/Suspense.i18n) is added in this library.

### 2. ErrorBoundary more simply

[bvaughn/react-error-boundary](https://github.com/bvaughn/react-error-boundary) that provide ErrorBoundary is popular library to use React's error-boundary concept declaratively. ErrorBoundary of bvaughn/react-error-boundary have fallback prop named like FallbackComponent, fallbackRender, fallback. We wanted to use the existing ErrorBoundary's somewhat complex fallback interface in something simpler like @suspensive/react's `<ErrorBoundary/>`.

It's why [`<ErrorBoundary/>`](/docs/react/src/ErrorBoundary.i18n) is added in this library.

### 3. Resetting multiple `<ErrorBoundary/>`s outside of fallback itself easily

To reset `<ErrorBoundary/>`, you can use reset method provided by fallback prop of `<ErrorBoundary/>`.
but If you want to reset multiple `<ErrorBoundary/>`s outside of its fallback, you have to provide new element of resetKeys to props of each `<ErrorBoundary/>`s. but If you use @suspensive/react's `<ErrorBoundaryGroup/>`, You don't need to do this tiresome. `<ErrorBoundaryGroup/>` will reset multiple `<ErrorBoundary/>`s easily.

It's why [`<ErrorBoundaryGroup/>`](/docs/react/src/ErrorBoundaryGroup.i18n) is added in this library.

### 4. Merging `<Suspense/>` and `<ErrorBoundary/>`

If Promise have pending, not only success also failure need to be treated at once easily.
so, I want to make a component wrapping `<Suspense/>`, `<ErrorBoundary/>` at once. also CSROnly is required to use this component in SSR environment like Next.js

It's why [`<AsyncBoundary/>`](/docs/react/src/AsyncBoundary.i18n) is added in this library.
