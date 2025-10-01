# @suspensive/react-dom

@suspensive/react-dom provides Suspensive interfaces specifically designed for react-dom, enhancing your React applications with better Suspense integration for DOM-specific features.

[![npm version](https://img.shields.io/npm/v/@suspensive/react-dom?color=000&labelColor=000&logo=npm&label=)](https://www.npmjs.com/package/@suspensive/react-dom)
[![npm](https://img.shields.io/npm/dm/@suspensive/react-dom?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/react-dom)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@suspensive/react-dom?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/react-dom)

## Installation

@suspensive/react-dom is available on npm. To install the latest stable version, run the following command:

```shell
npm install @suspensive/react-dom react-dom
```

## Features

- 🚀 **InView Component**: Uses IntersectionObserver to detect when elements enter/leave viewport
- 🎨 **FadeIn Animation**: Smooth fade-in animations for better UX
- 🎯 **Type-safe**: Full TypeScript support with excellent type inference
- ⚡ **Lightweight**: Minimal bundle size impact
- 🔄 **React 18+ Support**: Built for modern React with concurrent features

## Usage

### InView Component

The `<InView/>` component uses IntersectionObserver to detect when elements are visible in the viewport:

```jsx
import { InView } from '@suspensive/react-dom'
import { PrefetchQuery } from '@suspensive/react-query'

function PostsList({ posts }) {
  return (
    <div>
      {posts.map((post) => (
        <InView key={post.id}>
          {({ ref, isInView }) => (
            <div ref={ref}>
              {isInView && (
                <PrefetchQuery queryKey={['posts', post.id, 'comments']} queryFn={() => getPostComments(post.id)} />
              )}
              <h2>{post.title}</h2>
              <p>{post.description}</p>
            </div>
          )}
        </InView>
      ))}
    </div>
  )
}
```

### FadeIn Component

The `<FadeIn/>` component provides smooth fade-in animations:

```jsx
import { FadeIn } from '@suspensive/react-dom'

function App() {
  return (
    <FadeIn>
      <div>This content will fade in smoothly</div>
    </FadeIn>
  )
}
```

### Hooks

You can also use the underlying hooks directly:

```jsx
import { useInView, useFadeIn } from '@suspensive/react-dom'

function MyComponent() {
  const { ref, isInView } = useInView()
  const fadeInProps = useFadeIn()

  return (
    <div ref={ref} {...fadeInProps}>
      {isInView ? 'Visible!' : 'Not visible'}
    </div>
  )
}
```

## Documentation

For comprehensive guides, API references, and examples, visit [suspensive.org](https://suspensive.org).

## License

MIT © [Viva Republica, Inc.](https://github.com/toss/suspensive/blob/main/LICENSE)
