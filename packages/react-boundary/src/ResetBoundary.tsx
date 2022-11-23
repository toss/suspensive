import { ComponentProps, ComponentType, FC, ReactNode, createContext, useContext } from 'react'
import { useResetKey } from './hooks'

const defaultValue = {
  resetBoundaryKey: {},
  resetBoundary: () => {},
}

const ResetBoundaryContext = createContext(defaultValue)
if (process.env.NODE_ENV !== 'production') {
  ResetBoundaryContext.displayName = 'ResetBoundary'
}

export const ResetBoundaryProvider: FC<{
  children: ReactNode
}> = ({ children }) => {
  const { resetKey, reset } = useResetKey()

  return (
    <ResetBoundaryContext.Provider value={{ resetBoundaryKey: resetKey, resetBoundary: reset }}>
      {children}
    </ResetBoundaryContext.Provider>
  )
}

export const ResetBoundaryConsumer = ResetBoundaryContext.Consumer

export const useResetBoundary = () => {
  const context = useContext(ResetBoundaryContext)

  if (!context) {
    throw new Error('useResetBoundary error: Component using useResetBoundary require ResetBoundaryProvider as Parent')
  }

  return context
}

export const withResetBoundaryProvider = <P extends Record<string, unknown>>(Component: ComponentType<P>) => {
  const WrappedByResetBoundaryProvider = (props: P) => (
    <ResetBoundaryProvider>
      <Component {...props} />
    </ResetBoundaryProvider>
  )

  return WrappedByResetBoundaryProvider
}

export const ResetBoundary: FC<{
  children: ComponentProps<typeof ResetBoundaryConsumer>['children']
}> = ({ children }) => (
  <ResetBoundaryProvider>
    <ResetBoundaryConsumer>{children}</ResetBoundaryConsumer>
  </ResetBoundaryProvider>
)

export const withResetBoundary = <P extends Record<string, unknown> = Record<string, never>>(
  Component: ComponentType<P & Parameters<ComponentProps<typeof ResetBoundary>['children']>[0]>
) => {
  const WrappedComponent: FC<P & ComponentProps<typeof ResetBoundary>> = (props) => (
    <ResetBoundary>
      {({ resetBoundary, resetBoundaryKey }) => (
        <Component resetBoundary={resetBoundary} resetBoundaryKey={resetBoundaryKey} {...props} />
      )}
    </ResetBoundary>
  )

  return WrappedComponent
}
