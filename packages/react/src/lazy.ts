import { type ComponentType, type LazyExoticComponent, lazy as originalLazy } from 'react'
import { noop } from './utils/noop'

interface LazyOptions {
  onSuccess?: () => void
  onError?: ({ error }: { error: unknown }) => undefined | { fallback: ComponentType<any> }
}

/**
 * Creates a lazy function with custom default reload options
 *
 * @experimental This is experimental feature.
 *
 * @example
 * ```tsx
 * import { lazy } from '@suspensive/react'
 *
 * // Create a lazy factory with custom default reload count
 * const customLazy = lazy.create({ reload: 5 })
 *
 * // Use the factory to create lazy components
 * const Component1 = customLazy(() => import('./Component1'))
 * const Component2 = customLazy(() => import('./Component2'))
 *
 * // Override default options for specific component
 * const Component3 = customLazy(() => import('./Component3'), { reload: 2 })
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
    const defaultedOptions = {
      ...defaultOptions,
      ...options,
    }
    return Object.assign(
      originalLazy(async () => {
        const loaded = await load().catch((error: unknown) => {
          const onErrorResult = defaultedOptions.onError?.({ error: error })
          if (onErrorResult?.fallback) return { default: onErrorResult.fallback as unknown as T }
          throw error
        })
        defaultedOptions.onSuccess?.()
        return loaded
      }),
      { load: () => load().then(noop) }
    )
  }

/**
 * A reload wrapper around React.lazy that handles component loading failures gracefully
 *
 * @experimental This is experimental feature.
 *
 * @example
 * ```tsx
 * import { lazy, Suspense } from '@suspensive/react'
 *
 * // Basic usage with default reload (1 time)
 * const Component = lazy(() => import('./Component'))
 *
 * // Custom reload count
 * const ReloadComponent = lazy(() => import('./ReloadComponent'), { reload: 5 })
 *
 * // Infinite reload
 * const InfiniteReloadComponent = lazy(() => import('./InfiniteReloadComponent'), { reload: true })
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
 * const customLazy = lazy.create({ reload: 2 })
 * const CustomComponent = customLazy(() => import('./CustomComponent'))
 * ```
 *
 * @returns A lazy component with additional `load` method for preloading
 * @property {() => Promise<void>} load - Preloads the component without rendering it. Useful for prefetching components in the background.
 */
export const lazy = Object.assign(createLazy({}), {
  create: createLazy,
})
