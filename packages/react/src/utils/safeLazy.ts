import { type ComponentType, lazy, type LazyExoticComponent } from 'react'

/**
 * @experimental This is VERY experimental feature.
 *
 * Try to load the component.
 * If the component fails to load, it will reload the page.
 *
 * @example
 * ```tsx
 * const Component = safeLazy(() => import('./Component'))
 * ```
 *
 * @param importFunction
 * @returns
 */
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
