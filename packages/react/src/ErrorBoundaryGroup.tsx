'use client'

import { ComponentType, ReactNode, createContext, useContext, useEffect, useMemo } from 'react'
import { useKey, usePrevious } from './hooks'

export const ErrorBoundaryGroupContext = createContext<{ reset: () => void; resetKey: number } | undefined>(undefined)
if (process.env.NODE_ENV !== 'production') {
  ErrorBoundaryGroupContext.displayName = 'ErrorBoundaryGroupContext'
}

/**
 * ErrorBoundaryGroup is Component to manage multiple ErrorBoundaries
 * @see {@link https://suspensive.org/docs/react/src/ErrorBoundaryGroup.i18n Suspensive Official Docs}
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
  const parentGroup = useContext(ErrorBoundaryGroupContext)
  const previousParentGroup = usePrevious(parentGroup)

  useEffect(() => {
    if (!blockOutside && previousParentGroup?.resetKey !== parentGroup?.resetKey) {
      reset()
    }
  }, [previousParentGroup?.resetKey, parentGroup?.resetKey, reset, blockOutside])

  const value = useMemo(() => ({ reset, resetKey }), [reset, resetKey])

  return <ErrorBoundaryGroupContext.Provider value={value}>{children}</ErrorBoundaryGroupContext.Provider>
}

const ErrorBoundaryGroupReset = ({
  trigger: Trigger,
}: {
  /**
   * When you want to reset multiple ErrorBoundaries as children of ErrorBoundaryGroup, You can combine any other components with this trigger's reset
   */
  trigger: ComponentType<ReturnType<typeof useErrorBoundaryGroup>>
}) => {
  const errorBoundaryGroup = useErrorBoundaryGroup()

  return <Trigger reset={errorBoundaryGroup.reset} />
}

ErrorBoundaryGroup.Reset = ErrorBoundaryGroupReset

export const useErrorBoundaryGroup = () => {
  const group = useContext(ErrorBoundaryGroupContext)

  if (group === undefined) {
    throw new Error('useErrorBoundaryGroup: ErrorBoundaryGroup is required in parent')
  }

  return useMemo(
    () => ({
      /**
       * When you want to reset multiple ErrorBoundaries as children of ErrorBoundaryGroup, You can use this reset
       */
      reset: group.reset,
    }),
    [group.reset]
  )
}
