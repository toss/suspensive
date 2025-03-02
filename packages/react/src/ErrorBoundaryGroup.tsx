import {
  type ComponentProps,
  type ComponentType,
  type PropsWithChildren,
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import { useIsChanged } from './hooks'
import {
  Message_useErrorBoundaryGroup_this_hook_should_be_called_in_ErrorBoundary_props_children,
  SuspensiveError,
} from './models/SuspensiveError'
import type { PropsWithoutChildren } from './utility-types'
import { increase } from './utils'

export const ErrorBoundaryGroupContext = createContext<{ reset: () => void; resetKey: number } | undefined>(undefined)
if (process.env.NODE_ENV === 'development') {
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
 * ErrorBoundaryGroup is a wrapper component that allows you to manage multiple ErrorBoundaries easily.
 * ErrorBoundaries as children of nested ErrorBoundaryGroup will also be reset by parent ErrorBoundaryGroup.Consumer.
 * @see {@link https://suspensive.org/docs/react/ErrorBoundaryGroup Suspensive Docs}
 */
export const ErrorBoundaryGroup = Object.assign(
  ({ blockOutside = false, children }: ErrorBoundaryGroupProps) => {
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
  },
  {
    displayName: 'ErrorBoundaryGroup',
    wrap: <TProps extends ComponentProps<ComponentType> = Record<string, never>>(
      errorBoundaryGroupProps: PropsWithoutChildren<ErrorBoundaryGroupProps> = {},
      Component: ComponentType<TProps>
    ) =>
      Object.assign(
        (props: TProps) => (
          <ErrorBoundaryGroup {...errorBoundaryGroupProps}>
            <Component {...props} />
          </ErrorBoundaryGroup>
        ),
        { displayName: `ErrorBoundaryGroup.wrap(${Component.displayName || Component.name || 'Component'})` }
      ),
    Consumer: ({
      children,
    }: {
      children: (errorBoundaryGroup: ReturnType<typeof useErrorBoundaryGroup>) => ReactNode
    }) => <>{children(useErrorBoundaryGroup())}</>,
  }
)

/**
 * This hook provides the reset method for the ErrorBoundaryGroup.
 * Must be used within an ErrorBoundaryGroup component.
 * @see {@link https://suspensive.org/docs/react/ErrorBoundaryGroup#useerrorboundarygroup Suspensive Docs}
 */
export const useErrorBoundaryGroup = (): { reset: () => void } => {
  const group = useContext(ErrorBoundaryGroupContext)
  SuspensiveError.assert(
    group != null,
    Message_useErrorBoundaryGroup_this_hook_should_be_called_in_ErrorBoundary_props_children
  )
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
