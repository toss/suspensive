import { ComponentPropsWithoutRef, ComponentType, ReactNode, createContext, useContext, useEffect } from 'react'
import { useIsMounted, useKey } from './hooks'

export const ErrorBoundaryGroupContext = createContext({ resetKey: 0, reset: () => {} })
if (process.env.NODE_ENV !== 'production') {
  ErrorBoundaryGroupContext.displayName = 'ErrorBoundaryGroupContext'
}

export const ErrorBoundaryGroup = ({
  blockOutside = false,
  children,
}: {
  blockOutside?: boolean
  children?: ReactNode
}) => {
  const [resetKey, reset] = useKey()

  const isMounted = useIsMounted()
  const group = useContext(ErrorBoundaryGroupContext)
  useEffect(() => {
    if (isMounted && !blockOutside) {
      reset()
    }
  }, [group.resetKey, isMounted, reset])

  return <ErrorBoundaryGroupContext.Provider value={{ reset, resetKey }}>{children}</ErrorBoundaryGroupContext.Provider>
}

const ErrorBoundaryGroupReset = ({ trigger: Trigger }: { trigger: ComponentType<{ reset: () => void }> }) => {
  const { reset } = useErrorBoundaryGroup()

  return <Trigger reset={reset} />
}

ErrorBoundaryGroup.Reset = ErrorBoundaryGroupReset

export const useErrorBoundaryGroup = () => {
  const { reset } = useContext(ErrorBoundaryGroupContext)

  return { reset }
}

export const withErrorBoundaryGroup =
  <P extends Record<string, unknown> = Record<string, never>>(
    Component: ComponentType<P>,
    errorBoundaryGroupProps?: ComponentPropsWithoutRef<typeof ErrorBoundaryGroup>
  ) =>
  (props: P) =>
    (
      <ErrorBoundaryGroup {...errorBoundaryGroupProps}>
        <Component {...props} />
      </ErrorBoundaryGroup>
    )
