import { type ComponentType, type LazyExoticComponent, lazy as originalLazy } from 'react'
import { noop } from './utils/noop'

interface ReloadOptions {
  reload: number
}

const DEFAULT_RELOAD_COUNT = 3

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

const parseOptions = (options: ReloadOptions): ReloadOptions => {
  const parsedOptions = { reload: DEFAULT_RELOAD_COUNT }

  if (!Number.isInteger(options.reload) || options.reload <= 0) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[@suspensive/react] lazy: reload option must be a positive integer, but received ${options.reload}. ` +
          `Please provide a positive integer value (e.g., { reload: 3 }).`
      )
    }

    // Use default value on invalid input
    parsedOptions.reload = DEFAULT_RELOAD_COUNT
  } else {
    parsedOptions.reload = options.reload
  }

  return parsedOptions
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
const createLazy = (defaultOptions: ReloadOptions) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lazy = <T extends ComponentType<any>>(
    load: () => Promise<{ default: T }>,
    options?: ReloadOptions
  ): LazyExoticComponent<T> & {
    load: () => Promise<void>
  } => {
    const finalOptions = parseOptions(options || defaultOptions)

    return Object.assign(
      originalLazy(
        finalOptions.reload
          ? async (): Promise<{ default: T }> => {
              const storageKey = load.toString()
              const storedValue = window.sessionStorage.getItem(storageKey)
              const { reloadCount, isNaN } = parseReload(storedValue)

              if (isNaN) {
                window.sessionStorage.removeItem(storageKey)
              }

              try {
                const result = await load()
                window.sessionStorage.removeItem(storageKey)
                return result
              } catch (error) {
                if (reloadCount < finalOptions.reload) {
                  window.sessionStorage.setItem(storageKey, String(reloadCount + 1))
                  window.location.reload()
                  return { default: (() => null) as unknown as T }
                }
                throw error
              }
            }
          : load
      ),
      { load: () => load().then(noop) }
    )
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
 * // Basic usage with default reload (3 times)
 * const Component = lazy(() => import('./Component'))
 *
 * // Custom reload count
 * const ReloadComponent = lazy(() => import('./ReloadComponent'), { reload: 5 })
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
