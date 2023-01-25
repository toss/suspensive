import { ComponentPropsWithoutRef, ComponentType, ReactNode, createContext, useContext, useEffect } from 'react'
import { useIsMounted, useKey } from './hooks'

export const ErrorBoundaryGroupContext = createContext({ resetKey: 0, reset: () => {} })
if (process.env.NODE_ENV !== 'production') {
  ErrorBoundaryGroupContext.displayName = 'ErrorBoundaryGroupContext'
}

/**
 * ErrorBoundaryGroup is Component to manage multiple ErrorBoundaries
 * @see {@link https://docs.suspensive.org/docs/react/src/ErrorBoundaryGroup.i18n Suspensive Official Docs}
 * @see {@link https://github.com/toss/slash/pull/157 Pull Request to add ErrorBoundaryGroup in @toss/error-boundary}
 */
export const ErrorBoundaryGroup = ({
  blockOutside = false,
  children,
}: {
  /**
   * If you use blockOutside as true, ErrorBoundaryGroup will protect multiple ErrorBoundaries as its children from external ErrorBoundaryGroup's resetKey
   * @default false
   */
  blockOutside?: boolean
  /**
   * Use multiple ErrorBoundaries inside of children
   */
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

const ErrorBoundaryGroupReset = ({
  trigger: Trigger,
}: {
  /**
   * When you want to reset multiple ErrorBoundaries as children of ErrorBoundaryGroup, You can combine any other components with this trigger's reset
   */
  trigger: ComponentType<ReturnType<typeof useErrorBoundaryGroup>>
}) => {
  const { reset } = useErrorBoundaryGroup()

  return <Trigger reset={reset} />
}

ErrorBoundaryGroup.Reset = ErrorBoundaryGroupReset

export const useErrorBoundaryGroup = () => {
  const { reset } = useContext(ErrorBoundaryGroupContext)

  return {
    /**
     * When you want to reset multiple ErrorBoundaries as children of ErrorBoundaryGroup, You can use this reset
     */
    reset,
  }
}

export const withErrorBoundaryGroup = <P extends Record<string, unknown> = Record<string, never>>(
  Component: ComponentType<P>,
  errorBoundaryGroupProps?: ComponentPropsWithoutRef<typeof ErrorBoundaryGroup>
) => {
  const Wrapped = (props: P) => (
    <ErrorBoundaryGroup {...errorBoundaryGroupProps}>
      <Component {...props} />
    </ErrorBoundaryGroup>
  )

  if (process.env.NODE_ENV !== 'production') {
    const name = Component.displayName || Component.name || 'Component'
    Wrapped.displayName = `withErrorBoundaryGroup(${name})`
  }

  return Wrapped
}
