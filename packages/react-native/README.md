# @suspensive/react-native

@suspensive/react-native provides Suspensive interfaces specifically designed for React Native applications, enabling you to use React Suspense patterns seamlessly in your mobile apps.

[![npm version](https://img.shields.io/npm/v/@suspensive/react-native?color=000&labelColor=000&logo=npm&label=)](https://www.npmjs.com/package/@suspensive/react-native)
[![npm](https://img.shields.io/npm/dm/@suspensive/react-native?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/react-native)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@suspensive/react-native?color=000&labelColor=000)](https://www.npmjs.com/package/@suspensive/react-native)

## Installation

@suspensive/react-native is available on npm. To install the latest stable version, run the following command:

```shell npm2yarn
npm install @suspensive/react-native react-native
```

## Features

- 📱 **React Native optimized**: Designed specifically for React Native environments
- 🚀 **Suspense integration**: Seamless React Suspense support for mobile apps
- 🎯 **Type-safe**: Full TypeScript support with excellent type inference
- ⚡ **Performance focused**: Optimized for mobile performance
- 🔄 **Cross-platform**: Works on both iOS and Android

## Usage

```jsx
import { Suspense, ErrorBoundary } from '@suspensive/react-native'
import { Text, View, ActivityIndicator } from 'react-native'

function App() {
  return (
    <ErrorBoundary fallback={({ error }) => <Text>Error: {error.message}</Text>}>
      <Suspense fallback={<ActivityIndicator size="large" />}>
        <YourAsyncComponent />
      </Suspense>
    </ErrorBoundary>
  )
}
```

## Compatibility

- React Native 0.76.1+
- React 18+
- iOS and Android platforms
- Expo compatible

## Documentation

For comprehensive guides, API references, and examples, visit [suspensive.org](https://suspensive.org).

## License

MIT © [Viva Republica, Inc.](https://github.com/toss/suspensive/blob/main/LICENSE)