import { useCallback } from 'react'
import { type LazyComponent, useLazyContext } from '../contexts/LazyContext'

export interface UseLazyReturn {
  isLoading: boolean
  isLoaded: boolean
  load: () => Promise<void>
}

/**
 * Hook to track loading state of lazy components outside of Suspense boundaries.
 *
 * @experimental This is experimental feature.
 *
 * @param lazyComponent - A lazy component created with the `lazy()` function
 * @returns An object with `isLoading`, `isLoaded`, and `load` method
 *
 * @example
 * ```tsx
 * import { lazy, useLazy, LazyProvider } from '@suspensive/react'
 *
 * const Page1 = lazy(() => import('./Page1'))
 *
 * function NavItemToPage1() {
 *   const lazyPage1 = useLazy(Page1)
 *
 *   return (
 *     <Link onMouseEnter={() => lazyPage1.load()} to='/page1'>
 *       to Page1 {lazyPage1.isLoading ? 'loading...' : lazyPage1.isLoaded ? 'loaded' : 'not loaded'}
 *     </Link>
 *   )
 * }
 *
 * function App() {
 *   return (
 *     <LazyProvider>
 *       <NavItemToPage1 />
 *     </LazyProvider>
 *   )
 * }
 * ```
 */
export const useLazy = (lazyComponent: LazyComponent): UseLazyReturn => {
  const { states, setState } = useLazyContext()

  const state = states.get(lazyComponent) || { isLoading: false, isLoaded: false }

  const load = useCallback(async () => {
    // If already loaded or loading, don't start again
    if (state.isLoaded || state.isLoading) {
      return lazyComponent.load()
    }

    // Set loading state
    setState(lazyComponent, { isLoading: true })

    try {
      await lazyComponent.load()
      // Set loaded state on success
      setState(lazyComponent, { isLoading: false, isLoaded: true })
    } catch (error) {
      // Reset loading state on error
      setState(lazyComponent, { isLoading: false })
      throw error
    }
  }, [lazyComponent, state.isLoaded, state.isLoading, setState])

  return {
    isLoading: state.isLoading,
    isLoaded: state.isLoaded,
    load,
  }
}
