import { type ComponentType, type LazyExoticComponent, lazy as originalLazy } from 'react'
import { noop } from './utils/noop'

interface LazyOptions {
  onSuccess?: ({ load }: { load: () => Promise<void> }) => void
  onError?: ({ error, load }: { error: unknown; load: () => Promise<void> }) => undefined
}

/**
 * Creates a lazy function with custom default options
 *
 * @experimental This is experimental feature.
 *
 * @example
 * ```tsx
 * import { lazy } from '@suspensive/react'
 *
 * // Create a lazy factory with custom default options
 * const customLazy = lazy.create({
 *   onSuccess: () => console.log('Component loaded successfully'),
 *   onError: ({ error }) => console.error('Component loading failed:', error)
 * })
 *
 * // Use the factory to create lazy components
 * const Component1 = customLazy(() => import('./Component1'))
 * const Component2 = customLazy(() => import('./Component2'))
 *
 * // Override default options for specific component
 * const Component3 = customLazy(() => import('./Component3'), {
 *   onError: ({ error }) => {
 *     console.error('Custom error handling:', error)
 *     // Additional error handling logic
 *   }
 * })
 * ```
 */
const createLazy =
  (defaultOptions: LazyOptions) =>
  <T extends ComponentType<any>>(
    load: () => Promise<{ default: T }>,
    options?: LazyOptions
  ): LazyExoticComponent<T> & {
    load: () => Promise<void>
  } => {
    const defaultedOptions = { ...defaultOptions, ...options }
    const loadNoReturn = () => load().then(noop)
    return Object.assign(
      originalLazy(() =>
        load().then(
          (loaded) => {
            defaultedOptions.onSuccess?.({ load: loadNoReturn })
            return loaded
          },
          (error: unknown) => {
            defaultedOptions.onError?.({ error: error, load: loadNoReturn })
            throw error
          }
        )
      ),
      { load: loadNoReturn }
    )
  }

/**
 * A wrapper around React.lazy that provides error handling and success callbacks
 *
 * @experimental This is experimental feature.
 *
 * @example
 * ```tsx
 * import { lazy, Suspense } from '@suspensive/react'
 *
 * // Basic usage
 * const Component = lazy(() => import('./Component'))
 *
 * // With error handling and success callbacks
 * const ReloadComponent = lazy(() => import('./ReloadComponent'), {
 *   onError: ({ error }) => console.error('Loading failed:', error),
 *   onSuccess: () => console.log('Component loaded successfully')
 * })
 *
 * // Preloading component
 * function PreloadExample() {
 *   const handlePreload = () => {
 *     Component.load() // Preload the component
 *   }
 *
 *   return (
 *     <div>
 *       <button onClick={handlePreload}>Preload Component</button>
 *       <Suspense fallback={<div>Loading...</div>}>
 *         <Component />
 *       </Suspense>
 *     </div>
 *   )
 * }
 *
 * // Using lazy.create for factory pattern
 * const customLazy = lazy.create({
 *   onError: ({ error }) => console.error('Default error handling:', error)
 * })
 * const CustomComponent = customLazy(() => import('./CustomComponent'))
 * ```
 *
 * @returns A lazy component with additional `load` method for preloading
 * @property {() => Promise<void>} load - Preloads the component without rendering it. Useful for prefetching components in the background.
 */
export const lazy = Object.assign(createLazy({}), {
  create: createLazy,
})
