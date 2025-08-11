import { type ComponentType, type LazyExoticComponent, lazy as originalLazy } from 'react'
import { noop } from './utils/noop'

interface LazyOptions {
  onSuccess?: ({ load }: { load: () => Promise<void> }) => void
  onError?: ({ error, load }: { error: unknown; load: () => Promise<void> }) => undefined
}

/**
 * Creates a lazy function with custom default options
 *
 * The default `lazy` export is equivalent to `createLazy({})`.
 *
 * @experimental This is experimental feature.
 *
 * @description
 * The created lazy function will execute individual callbacks first, then default callbacks.
 * For onSuccess: individual onSuccess → default onSuccess
 * For onError: individual onError → default onError
 *
 * @example
 * ```tsx
 * import { createLazy } from '@suspensive/react'
 *
 * // Create a lazy factory with custom default options
 * const lazy = createLazy({
 *   onSuccess: () => console.log('Component loaded successfully'),
 *   onError: ({ error }) => console.error('Component loading failed:', error)
 * })
 *
 * // Use the factory to create lazy components
 * const Component1 = lazy(() => import('./Component1'))
 * const Component2 = lazy(() => import('./Component2'))
 *
 * // Individual options are executed after default options
 * const Component3 = lazy(() => import('./Component3'), {
 *   onError: ({ error }) => {
 *     console.error('Individual error handling:', error)
 *     // This callback runs after the default onError callback
 *   }
 * })
 * ```
 */
export const createLazy =
  (defaultOptions: LazyOptions) =>
  <T extends ComponentType<any>>(
    load: () => Promise<{ default: T }>,
    options?: LazyOptions
  ): LazyExoticComponent<T> & {
    load: () => Promise<void>
  } => {
    const composedOnSuccess = ({ load }: { load: () => Promise<void> }) => {
      options?.onSuccess?.({ load })
      defaultOptions.onSuccess?.({ load })
    }

    const composedOnError = ({ error, load }: { error: unknown; load: () => Promise<void> }) => {
      options?.onError?.({ error, load })
      defaultOptions.onError?.({ error, load })
    }

    const loadNoReturn = () => load().then(noop)
    return Object.assign(
      originalLazy(() =>
        load().then(
          (loaded) => {
            composedOnSuccess({ load: loadNoReturn })
            return loaded
          },
          (error: unknown) => {
            composedOnError({ error: error, load: loadNoReturn })
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
 * This is equivalent to `createLazy({})` - a lazy function with no default options.
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
 * // Using createLazy for factory pattern
 * const lazy = createLazy({
 *   onError: ({ error }) => console.error('Default error handling:', error)
 * })
 * const CustomComponent = lazy(() => import('./CustomComponent'))
 * ```
 *
 * @returns A lazy component with additional `load` method for preloading
 * @property {() => Promise<void>} load - Preloads the component without rendering it. Useful for prefetching components in the background.
 */
export const lazy = createLazy({})

interface ReloadOnErrorStorage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

interface ReloadOnErrorOptions extends LazyOptions {
  /**
   * The number of times to retry the loading of the component. \
   * If `true`, the component will be retried indefinitely.
   *
   * @default 1
   */
  retry?: number | boolean
  /**
   * The delay between retries. \
   * If a function is provided, it will be called with the current retry count.
   *
   * @default 0
   */
  retryDelay?: number | ((retryCount: number) => number)
  /**
   * The storage to use for the retry count. \
   * If not provided, it assumes that you are in a browser environment and uses `window.sessionStorage`.
   *
   * @default window.sessionStorage
   */
  storage?: ReloadOnErrorStorage
  /**
   * The function to use to reload the component. \
   * If not provided, it assumes that you are in a browser environment and uses `window.location.reload`.
   *
   * @default window.location.reload
   */
  reload?: (timeoutId: ReturnType<typeof setTimeout>) => void
}

/**
 * Options for reloading page if the component fails to load.
 *
 * @experimental This is experimental feature.
 *
 * @example
 * ```tsx
 * import { createLazy, reloadOnError } from '@suspensive/react'
 *
 * const customLazy = createLazy(reloadOnError({ retry: 1, retryDelay: 1000 }))
 * const Component = customLazy(() => import('./Component'))
 * ```
 */
export const reloadOnError = ({
  retry = 1,
  retryDelay = 0,
  storage,
  reload,
  ...options
}: ReloadOnErrorOptions): LazyOptions => {
  const reloadStorage = (() => {
    if (storage) return storage
    if (typeof window !== 'undefined' && 'sessionStorage' in window) return window.sessionStorage
    throw new Error('[@suspensive/react] No storage provided and no sessionStorage in window')
  })()
  const reloadFunction = (() => {
    if (reload) return reload
    if (typeof window !== 'undefined' && 'location' in window) return () => window.location.reload()
    throw new Error('[@suspensive/react] No reload function provided and no location in window')
  })()

  return {
    ...options,
    onSuccess: ({ load }) => {
      options.onSuccess?.({ load })
      reloadStorage.removeItem(load.toString())
    },
    onError: ({ error, load }) => {
      options.onError?.({ error, load })

      const storageKey = load.toString()
      let currentRetryCount = 0

      if (typeof retry === 'number') {
        const storedValue = reloadStorage.getItem(storageKey)
        if (storedValue) {
          const reloadCount = parseInt(storedValue, 10)
          if (Number.isNaN(reloadCount)) reloadStorage.removeItem(storageKey)
          currentRetryCount = reloadCount
        }
      }

      const shouldRetry = retry === true || (typeof retry === 'number' && currentRetryCount < retry)
      if (!shouldRetry) return
      if (typeof retry === 'number') reloadStorage.setItem(storageKey, String(currentRetryCount + 1))
      const delayValue = typeof retryDelay === 'function' ? retryDelay(currentRetryCount) : retryDelay
      const timeoutId = setTimeout(() => {
        reloadFunction(timeoutId)
      }, delayValue)
    },
  }
}
