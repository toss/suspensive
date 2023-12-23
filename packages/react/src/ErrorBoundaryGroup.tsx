import type { PropsWithChildren, ReactNode } from 'react'
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { useIsChanged } from './hooks'
import { assert, increase } from './utils'

export const ErrorBoundaryGroupContext = createContext<{ reset: () => void; resetKey: number } | undefined>(undefined)
if (process.env.NODE_ENV !== 'production') {
  ErrorBoundaryGroupContext.displayName = 'ErrorBoundaryGroupContext'
}

export interface ErrorBoundaryGroupProps extends PropsWithChildren {
  /**
   * If you use blockOutside as true, ErrorBoundaryGroup will protect multiple ErrorBoundaries as its children from external ErrorBoundaryGroup's resetKey
   * @default false
   */
  blockOutside?: boolean
}

/**
 * ErrorBoundaryGroup is Component to manage multiple ErrorBoundaries
 * @see {@link https://suspensive.org/docs/react/ErrorBoundaryGroup}
 */
export const ErrorBoundaryGroup = ({ blockOutside = false, children }: ErrorBoundaryGroupProps) => {
  const [resetKey, reset] = useReducer(increase, 0)
  const parentGroup = useContext(ErrorBoundaryGroupContext)
  const isParentGroupResetKeyChanged = useIsChanged(parentGroup?.resetKey)

  useEffect(() => {
    if (!blockOutside && isParentGroupResetKeyChanged) {
      reset()
    }
  }, [isParentGroupResetKeyChanged, blockOutside])

  const value = useMemo(() => ({ reset, resetKey }), [resetKey])

  return <ErrorBoundaryGroupContext.Provider value={value}>{children}</ErrorBoundaryGroupContext.Provider>
}
if (process.env.NODE_ENV !== 'production') {
  ErrorBoundaryGroup.displayName = 'ErrorBoundaryGroup'
}

const ErrorBoundaryGroupReset = ({
  trigger,
}: {
  /**
   * When you want to reset multiple ErrorBoundaries as children of ErrorBoundaryGroup, You can combine any other components with this trigger's reset
   */
  trigger: (errorBoundaryGroup: ReturnType<typeof useErrorBoundaryGroup>) => ReactNode
}) => trigger(useErrorBoundaryGroup())
ErrorBoundaryGroup.Reset = ErrorBoundaryGroupReset

export const useErrorBoundaryGroup = () => {
  const group = useContext(ErrorBoundaryGroupContext)
  assert(group != null, assert.message.useErrorBoundaryGroup.onlyInChildrenOfErrorBoundaryGroup)
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
