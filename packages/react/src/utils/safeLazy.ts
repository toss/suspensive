import { type ComponentType, type LazyExoticComponent, lazy } from 'react'

/**
 * A safe wrapper around React.lazy that handles component loading failures gracefully
 *
 * @experimental This is VERY experimental feature.
 *
 * @example
 * ```tsx
 * const Component = safeLazy(() => import('./Component'))
 * ```
 *
 * @param importFunction
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const safeLazy = <T extends ComponentType<any>>(
  importFunction: () => Promise<{ default: T }>
): LazyExoticComponent<T> => {
  const tryImport = async (): Promise<{ default: T }> => {
    const storageKey = importFunction.toString()
    try {
      const result = await importFunction()
      window.sessionStorage.removeItem(storageKey)
      return result
    } catch (error) {
      if (!window.sessionStorage.getItem(storageKey)) {
        window.sessionStorage.setItem(storageKey, 'true')
        window.location.reload()

        return { default: () => null } as unknown as { default: T }
      }

      throw error
    }
  }

  return lazy(async () => {
    return await tryImport()
  })
}
