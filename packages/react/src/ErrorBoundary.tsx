import {
  Component,
  ComponentProps,
  ComponentType,
  ErrorInfo,
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
  createContext,
  createElement,
  forwardRef,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ErrorBoundaryGroupContext } from './ErrorBoundaryGroup'
import { awaitClient } from './experimental/Await'
import { PropsWithoutChildren } from './types'
import { hasResetKeysChanged } from './utils'

export type ErrorBoundaryFallbackProps = {
  /**
   * when ErrorBoundary catch error, you can use this error
   */
  error: Error
  /**
   * when you want to reset caught error, you can use this reset
   */
  reset: () => void
}

type ErrorBoundaryProps = PropsWithChildren<{
  /**
   * an array of elements for the ErrorBoundary to check each render. If any of those elements change between renders, then the ErrorBoundary will reset the state which will re-render the children
   */
  resetKeys?: unknown[]
  /**
   * when ErrorBoundary is reset by resetKeys or fallback's props.reset, onReset will be triggered
   */
  onReset?(): void
  /**
   * when ErrorBoundary catch error, onError will be triggered
   */
  onError?(error: Error, info: ErrorInfo): void
  /**
   * when ErrorBoundary catch error, fallback will be render instead of children
   */
  fallback: NonNullable<ReactNode> | FunctionComponent<ErrorBoundaryFallbackProps>
}>

type ErrorBoundaryState<TError extends Error = Error> =
  | {
      isError: true
      error: TError
    }
  | {
      isError: false
      error: null
    }

const initialState: ErrorBoundaryState = {
  isError: false,
  error: null,
}

class BaseErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { isError: true, error }
  }

  state = initialState

  componentDidUpdate(prevProps: ErrorBoundaryProps, prevState: ErrorBoundaryState) {
    const { isError } = this.state
    const { resetKeys } = this.props
    if (isError && prevState.isError && hasResetKeysChanged(prevProps.resetKeys, resetKeys)) {
      this.reset()
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info)
  }

  reset() {
    this.props.onReset?.()
    awaitClient.clearError()
    this.setState(initialState)
  }

  render() {
    const { children, fallback } = this.props

    return (
      <ErrorBoundaryContext.Provider
        value={{
          ...this.state,
          reset: this.reset,
        }}
      >
        {this.state.isError
          ? typeof fallback === 'function'
            ? createElement(fallback, {
                error: this.state.error,
                reset: this.reset,
              })
            : fallback
          : children}
      </ErrorBoundaryContext.Provider>
    )
  }
}

/**
 * This component provide a simple and reusable wrapper that you can use to wrap around your components. Any rendering errors in your components hierarchy can then be gracefully handled.
 * @see {@link https://suspensive.org/docs/react/src/ErrorBoundary.i18n Suspensive Official Docs}
 */
export const ErrorBoundary = forwardRef<{ reset(): void }, ErrorBoundaryProps>((props, resetRef) => {
  const group = useContext(ErrorBoundaryGroupContext) ?? { resetKey: 0 }
  const resetKeys = [group.resetKey, ...(props.resetKeys || [])]

  const ref = useRef<BaseErrorBoundary>(null)
  useImperativeHandle(resetRef, () => ({
    reset: () => ref.current?.reset(),
  }))

  return <BaseErrorBoundary {...props} resetKeys={resetKeys} ref={ref} />
})
if (process.env.NODE_ENV !== 'production') {
  ErrorBoundary.displayName = 'ErrorBoundary'
}

// HOC
export const withErrorBoundary = <TProps extends ComponentProps<ComponentType> = Record<string, never>>(
  Component: ComponentType<TProps>,
  errorBoundaryProps: PropsWithoutChildren<ErrorBoundaryProps>
) => {
  const Wrapped = (props: TProps) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  if (process.env.NODE_ENV !== 'production') {
    const name = Component.displayName || Component.name || 'Component'
    Wrapped.displayName = `withErrorBoundary(${name})`
  }

  return Wrapped
}

type ErrorBoundaryContextType<TError extends Error = Error> = {
  reset: () => void
} & ErrorBoundaryState<TError>

const ErrorBoundaryContext = createContext<ErrorBoundaryContextType | null>(null)

export const useErrorBoundary = <TError extends Error = Error>() => {
  const [state, setState] = useState<ErrorBoundaryState<TError>>({
    isError: false,
    error: null,
  })

  if (state.isError) {
    throw state.error
  }

  const context = useContext(ErrorBoundaryContext)
  assert(
    context != null && typeof context.isError === 'boolean' && typeof context.reset === 'function',
    'ErrorBoundary is required in parent'
  )

  return useMemo(
    () => ({
      reset: () => {
        context.reset()
        setState({ isError: false, error: null })
      },
      error: (error: TError) => setState({ isError: true, error }),
    }),
    [context]
  )
}
