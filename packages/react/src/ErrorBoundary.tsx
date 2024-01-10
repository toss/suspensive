import {
  Component,
  type ErrorInfo,
  type FunctionComponent,
  type PropsWithChildren,
  type ReactNode,
  createContext,
  forwardRef,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useDevModeObserve } from './contexts'
import { Delay } from './Delay'
import { ErrorBoundaryGroupContext } from './ErrorBoundaryGroup'
import type { ConstructorType, PropsWithDevMode } from './utility-types'
import { assert, hasResetKeysChanged } from './utils'
import {
  useErrorBoundaryFallbackProps_this_hook_should_be_called_in_ErrorBoundary_props_fallback,
  useErrorBoundary_this_hook_should_be_called_in_ErrorBoundary_props_children,
} from './utils/assert'

export interface ErrorBoundaryFallbackProps<TError extends Error = Error> {
  /**
   * when ErrorBoundary catch error, you can use this error
   */
  error: TError
  /**
   * when you want to reset caught error, you can use this reset
   */
  reset: () => void
}

type ShouldCatchCallback = (error: Error) => boolean
type ShouldCatch = ConstructorType<Error> | ShouldCatchCallback
const checkErrorBoundary = (shouldCatch: ShouldCatch, error: Error) =>
  shouldCatch.prototype instanceof Error ? error instanceof shouldCatch : (shouldCatch as ShouldCatchCallback)(error)

export type ErrorBoundaryProps = PropsWithDevMode<
  PropsWithChildren<{
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
    fallback: ReactNode | FunctionComponent<ErrorBoundaryFallbackProps>
    /**
     * @experimental This is experimental feature.
     * @default true
     */
    shouldCatch?: ShouldCatch | [ShouldCatch, ...ShouldCatch[]] | boolean
  }>,
  ErrorBoundaryDevModeOptions
>

type ErrorBoundaryState<TError extends Error = Error> =
  | { isError: true; error: TError }
  | { isError: false; error: null }

const initialErrorBoundaryState: ErrorBoundaryState = {
  isError: false,
  error: null,
}
class BaseErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { isError: true, error }
  }

  state = initialErrorBoundaryState

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

  reset = () => {
    this.props.onReset?.()
    this.setState(initialErrorBoundaryState)
  }

  render() {
    const { children, fallback, shouldCatch = true } = this.props
    const { isError, error } = this.state

    let childrenOrFallback = children

    if (isError) {
      const isCatch = Array.isArray(shouldCatch)
        ? shouldCatch.some((shouldCatch) => checkErrorBoundary(shouldCatch, error))
        : typeof shouldCatch === 'boolean'
          ? shouldCatch
          : checkErrorBoundary(shouldCatch, error)
      if (!isCatch) {
        throw error
      }
      if (typeof fallback === 'undefined') {
        if (process.env.NODE_ENV !== 'production') {
          console.error('ErrorBoundary of @suspensive/react requires a defined fallback')
        }
        throw error
      }

      if (typeof fallback === 'function') {
        const FallbackComponent = fallback
        childrenOrFallback = <FallbackComponent error={error} reset={this.reset} />
      } else {
        childrenOrFallback = fallback
      }
    }

    return (
      <ErrorBoundaryContext.Provider value={{ ...this.state, reset: this.reset }}>
        {childrenOrFallback}
      </ErrorBoundaryContext.Provider>
    )
  }
}

/**
 * This component provide a simple and reusable wrapper that you can use to wrap around your components. Any rendering errors in your components hierarchy can then be gracefully handled.
 * @see {@link https://suspensive.org/docs/react/ErrorBoundary}
 */
export const ErrorBoundary = forwardRef<{ reset(): void }, ErrorBoundaryProps>(
  ({ devMode, fallback, children, onError, onReset, resetKeys, ...props }, ref) => {
    const group = useContext(ErrorBoundaryGroupContext) ?? { resetKey: 0 }
    const baseErrorBoundaryRef = useRef<BaseErrorBoundary>(null)
    useImperativeHandle(ref, () => ({
      reset: () => baseErrorBoundaryRef.current?.reset(),
    }))

    return (
      <BaseErrorBoundary
        {...props}
        fallback={fallback}
        onError={onError}
        onReset={onReset}
        resetKeys={[group.resetKey, ...(resetKeys || [])]}
        ref={baseErrorBoundaryRef}
      >
        {children}
        {process.env.NODE_ENV !== 'production' && devMode && <ErrorBoundaryDevMode {...devMode} />}
      </BaseErrorBoundary>
    )
  }
)
if (process.env.NODE_ENV !== 'production') {
  ErrorBoundary.displayName = 'ErrorBoundary'
}

const ErrorBoundaryContext = createContext<({ reset: () => void } & ErrorBoundaryState) | null>(null)
if (process.env.NODE_ENV !== 'production') {
  ErrorBoundaryContext.displayName = 'ErrorBoundaryContext'
}

export const useErrorBoundary = <TError extends Error = Error>() => {
  const [state, setState] = useState<ErrorBoundaryState<TError>>({
    isError: false,
    error: null,
  })
  if (state.isError) {
    throw state.error
  }

  const errorBoundary = useContext(ErrorBoundaryContext)
  assert(
    errorBoundary != null && !errorBoundary.isError,
    useErrorBoundary_this_hook_should_be_called_in_ErrorBoundary_props_children
  )

  return useMemo(
    () => ({
      setError: (error: TError) => setState({ isError: true, error }),
    }),
    []
  )
}

export const useErrorBoundaryFallbackProps = <TError extends Error = Error>(): ErrorBoundaryFallbackProps<TError> => {
  const errorBoundary = useContext(ErrorBoundaryContext)
  assert(
    errorBoundary != null && errorBoundary.isError,
    useErrorBoundaryFallbackProps_this_hook_should_be_called_in_ErrorBoundary_props_fallback
  )

  return useMemo(
    () => ({
      error: errorBoundary.error as TError,
      reset: errorBoundary.reset,
    }),
    [errorBoundary.error, errorBoundary.reset]
  )
}

/**
 * @experimental This is experimental feature.
 */
type ErrorBoundaryDevModeOptions = {
  /**
   * @experimental This is experimental feature.
   */
  showFallback?:
    | boolean
    | {
        /**
         * @experimental This is experimental feature.
         */
        errorMessage?: string
        /**
         * @experimental This is experimental feature.
         */
        after?: number
      }
}
const ErrorBoundaryDevMode = ({ showFallback = false }: ErrorBoundaryDevModeOptions) => {
  const devMode = useDevModeObserve()
  if (devMode?.is && showFallback) {
    if (showFallback === true) {
      showFallback = devModeDefaultErrorBoundaryShowFallback
    }

    return (
      <Delay ms={showFallback.after ?? devModeDefaultErrorBoundaryShowFallback.after}>
        <SetError errorMessage={showFallback.errorMessage ?? devModeDefaultErrorBoundaryShowFallback.errorMessage} />
      </Delay>
    )
  }
  return null
}

const devModeDefaultErrorBoundaryShowFallback = {
  errorMessage: `<DevMode.ErrorBoundary> set Error ErrorBoundary`,
  after: 0,
} as const

const SetError = ({ errorMessage }: { errorMessage: string }) => {
  useErrorBoundary().setError(new Error(errorMessage))
  return null
}
