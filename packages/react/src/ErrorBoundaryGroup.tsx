import type { ComponentProps, ComponentType, PropsWithChildren } from 'react'
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { useIsChanged } from './hooks'
import type { PropsWithoutChildren } from './types'
import { assert } from './utils'
import { wrap } from './wrap'

export const ErrorBoundaryGroupContext = createContext<{ reset: () => void; resetKey: number } | undefined>(undefined)
if (process.env.NODE_ENV !== 'production') {
  ErrorBoundaryGroupContext.displayName = 'ErrorBoundaryGroupContext'
}

export type ErrorBoundaryGroupProps = PropsWithChildren<{
  /**
   * If you use blockOutside as true, ErrorBoundaryGroup will protect multiple ErrorBoundaries as its children from external ErrorBoundaryGroup's resetKey
   * @default false
   */
  blockOutside?: boolean
}>

const increase = (prev: number) => prev + 1

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

  const value = useMemo(() => ({ reset, resetKey }), [reset, resetKey])

  return <ErrorBoundaryGroupContext.Provider value={value}>{children}</ErrorBoundaryGroupContext.Provider>
}
if (process.env.NODE_ENV !== 'production') {
  ErrorBoundaryGroup.displayName = 'ErrorBoundaryGroup'
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

export const withErrorBoundaryGroup = <TProps extends ComponentProps<ComponentType> = Record<string, never>>(
  component: ComponentType<TProps>,
  errorBoundaryGroupProps: PropsWithoutChildren<ErrorBoundaryGroupProps> = {}
) => wrap.ErrorBoundaryGroup(errorBoundaryGroupProps).on(component)
