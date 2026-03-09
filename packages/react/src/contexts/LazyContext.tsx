import {
  type ComponentType,
  type LazyExoticComponent,
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react'

export type LazyComponent = LazyExoticComponent<ComponentType<any>> & {
  load: () => Promise<void>
}

type LazyState = {
  isLoading: boolean
  isLoaded: boolean
}

type LazyContextType = {
  states: Map<LazyComponent, LazyState>
  setState: (component: LazyComponent, state: Partial<LazyState>) => void
}

const LazyContext = createContext<LazyContextType | null>(null)
LazyContext.displayName = 'LazyContext'

export interface LazyProviderProps extends PropsWithChildren {
  // No additional props needed
}

/**
 * Provider component that manages the loading states of lazy components.
 * This allows tracking lazy component states outside of Suspense boundaries.
 *
 * @example
 * ```tsx
 * import { LazyProvider } from '@suspensive/react'
 *
 * function App() {
 *   return (
 *     <LazyProvider>
 *       <YourApp />
 *     </LazyProvider>
 *   )
 * }
 * ```
 */
export const LazyProvider = ({ children }: LazyProviderProps) => {
  const [states, setStates] = useState<Map<LazyComponent, LazyState>>(() => new Map())

  const setState = (component: LazyComponent, state: Partial<LazyState>) => {
    setStates((prevStates) => {
      const newStates = new Map(prevStates)
      const currentState = newStates.get(component) || { isLoading: false, isLoaded: false }
      const newState: LazyState = {
        isLoading: state.isLoading !== undefined ? state.isLoading : currentState.isLoading,
        isLoaded: state.isLoaded !== undefined ? state.isLoaded : currentState.isLoaded,
      }
      newStates.set(component, newState)
      return newStates
    })
  }

  return <LazyContext.Provider value={{ states, setState }}>{children}</LazyContext.Provider>
}

export const useLazyContext = () => {
  const context = useContext(LazyContext)
  if (!context) {
    throw new Error('useLazyContext must be used within a LazyProvider')
  }
  return context
}
