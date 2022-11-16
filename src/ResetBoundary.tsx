import { ComponentType, createContext, FC, ReactNode, useContext } from 'react'
import { useResetKey } from './hooks'

const defaultValue = {
  resetKey: -1,
  reset: () => {},
}

const ResetBoundary = createContext(defaultValue)
if (process.env.NODE_ENV !== 'production') {
  ResetBoundary.displayName = 'ResetBoundary'
}

export const ResetBoundaryProvider: FC<{
  children: ReactNode
}> = ({ children }) => {
  const { resetKey, reset } = useResetKey()

  return <ResetBoundary.Provider value={{ resetKey, reset }}>{children}</ResetBoundary.Provider>
}

export const ResetBoundaryConsumer = ResetBoundary.Consumer

export const useResetBoundary = () => {
  const context = useContext(ResetBoundary)

  if (!context) {
    throw new Error('useResetBoundary error: Component using useResetBoundary require ResetBoundaryProvider as Parent')
  }

  return context
}

export const withResetBoundary = <P extends Record<string, unknown>>(Component: ComponentType<P>) => {
  const Wrapped = (props: P) => {
    return (
      <ResetBoundaryProvider>
        <Component {...props} />
      </ResetBoundaryProvider>
    )
  }

  return Wrapped
}
