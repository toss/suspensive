import { type ComponentType, type LazyExoticComponent, lazy as originalLazy } from 'react'
import { noop } from './utils/noop'

interface LazyOptions {
  reload: number | boolean
}

const DEFAULT_RELOAD_COUNT = 1

const parseReload = (value: string | null): { reloadCount: number; isNaN: boolean } => {
  if (!value) {
    return {
      reloadCount: 0,
      isNaN: true,
    }
  }

  const reloadCount = parseInt(value, 10)
  const isNaN = Number.isNaN(reloadCount)

  return {
    reloadCount: isNaN ? 0 : reloadCount,
    isNaN,
  }
}

const mergeOptions = (options: Partial<LazyOptions> | undefined, defaultOptions: LazyOptions): LazyOptions => {
  const keys = Object.keys(defaultOptions) as (keyof LazyOptions)[]
  const mergedOptions = keys.reduce<Partial<LazyOptions>>((acc, key) => {
    acc[key] = options != null && key in options ? options[key] : defaultOptions[key]
    return acc
  }, {}) as LazyOptions

  if (process.env.NODE_ENV === 'development') {
    if (
      typeof mergedOptions.reload === 'number' &&
      (!Number.isInteger(mergedOptions.reload) || mergedOptions.reload <= 0)
    ) {
      console.error(
        `[@suspensive/react] lazy: reload option must be a positive integer, but received ${mergedOptions.reload}. ` +
          `Please provide a positive integer value (e.g., { reload: 3 }).`
      )
    }
  }

  return mergedOptions
}

const createLoader = <T extends ComponentType<unknown>>(
  load: () => Promise<{ default: T }>,
  reload: LazyOptions['reload']
): (() => Promise<{ default: T }>) => {
  // If it's falsy(`false` or `0`), return the original load function
  if (!reload) {
    return load
  }

  return async (): Promise<{ default: T }> => {
    const storageKey = load.toString()
    let currentReloadCount = 0

    if (typeof reload === 'number') {
      const storedValue = window.sessionStorage.getItem(storageKey)
      const parsed = parseReload(storedValue)
      currentReloadCount = parsed.reloadCount

      if (parsed.isNaN) {
        window.sessionStorage.removeItem(storageKey)
      }
    }

    try {
      const result = await load()
      if (typeof reload === 'number') {
        window.sessionStorage.removeItem(storageKey)
      }
      return result
    } catch (error) {
      const shouldRetry = reload === true || (typeof reload === 'number' && currentReloadCount < reload)

      if (shouldRetry) {
        // Update storage for finite retries
        if (typeof reload === 'number') {
          window.sessionStorage.setItem(storageKey, String(currentReloadCount + 1))
        }
        window.location.reload()
        return { default: (() => null) as unknown as T }
      }
      throw error
    }
  }
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
const createLazy = (defaultOptions: LazyOptions) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lazy = <T extends ComponentType<any>>(
    load: () => Promise<{ default: T }>,
    options?: LazyOptions
  ): LazyExoticComponent<T> & {
    load: () => Promise<void>
  } => {
    const mergedOptions = mergeOptions(options, defaultOptions)
    const loader = createLoader(load, mergedOptions.reload)

    return Object.assign(originalLazy(loader), { load: () => load().then(noop) })
  }

  return lazy
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
export const lazy = Object.assign(createLazy({ reload: DEFAULT_RELOAD_COUNT }), {
  create: createLazy,
})
