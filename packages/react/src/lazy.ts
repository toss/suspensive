import { type ComponentType, type LazyExoticComponent, lazy as originalLazy } from 'react'
import { noop } from './utils/noop'

/**
 * A safe wrapper around React.lazy that handles component loading failures gracefully
 *
 * @experimental This is experimental feature.
 *
 * @example
 * ```tsx
 * import { lazy } from '@suspensive/react'
 *
 * const Component = lazy(() => import('./Component'), { safe: true })
 * ```
 */
export const lazy = <T extends ComponentType<any>>(
  load: () => Promise<{ default: T }>,
  options?: { safe: boolean }
): LazyExoticComponent<T> & {
  load: () => Promise<void>
} =>
  Object.assign(
    originalLazy(
      options?.safe
        ? async (): Promise<{ default: T }> => {
            const storageKey = load.toString()
            try {
              const result = await load()
              window.sessionStorage.removeItem(storageKey)
              return result
            } catch (error) {
              if (!window.sessionStorage.getItem(storageKey)) {
                window.sessionStorage.setItem(storageKey, 'true')
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
