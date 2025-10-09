import {
  Component,
  type ComponentProps,
  type ComponentType,
  type ErrorInfo,
  type ForwardRefExoticComponent,
  type ForwardedRef,
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
import { ErrorBoundaryGroupContext } from './ErrorBoundaryGroup'
import {
  Message_useErrorBoundaryFallbackProps_this_hook_should_be_called_in_ErrorBoundary_props_fallback,
  Message_useErrorBoundary_this_hook_should_be_called_in_ErrorBoundary_props_children,
  SuspensiveError,
} from './models/SuspensiveError'
import type { ConstructorType } from './utility-types/ConstructorType'
import type { PropsWithoutChildren } from './utility-types/PropsWithoutChildren'
import { hasResetKeysChanged } from './utils/hasResetKeysChanged'

interface ErrorBoundaryHandle {
  /**
   * when you want to reset caught error, you can use this reset
   */
  reset: () => void
}

export interface ErrorBoundaryFallbackProps<TError extends Error = Error> extends ErrorBoundaryHandle {
  /**
   * when ErrorBoundary catch error, you can use this error
   */
  error: TError
}

/**
 * Type guard function that narrows error type
 */
type ErrorTypeGuard<TError extends Error = Error> = (error: Error) => error is TError

/**
 * Validation function without type narrowing
 */
type ErrorValidator = (error: Error) => boolean

type ErrorMatcher<TError extends Error = Error> =
  | boolean
  | ConstructorType<TError>
  | ErrorTypeGuard<TError>
  | ErrorValidator

type ShouldCatch<TError extends Error = Error> = ErrorMatcher<TError> | readonly ErrorMatcher<TError>[]

/**
 * Extract error type from a single matcher
 */
type ExtractErrorType<T> =
  T extends ConstructorType<infer E extends Error> ? E : T extends ErrorTypeGuard<infer E extends Error> ? E : Error

/**
 * Extract error types from array (via union of element types)
 */
type ExtractErrorTypes<T extends readonly ErrorMatcher[]> = ExtractErrorType<T[number]>

/**
 * Main type inference from shouldCatch
 */
type InferError<T> = T extends readonly ErrorMatcher[]
  ? ExtractErrorTypes<T> extends never
    ? Error
    : ExtractErrorTypes<T>
  : T extends ErrorMatcher
    ? ExtractErrorType<T>
    : Error

const matchError = <TError extends Error>(matcher: ErrorMatcher<TError>, error: Error): boolean => {
  if (typeof matcher === 'boolean') {
    return matcher
  }
  if (typeof matcher === 'function') {
    try {
      if (matcher.prototype && (matcher.prototype instanceof Error || matcher.prototype === Error.prototype)) {
        return error instanceof (matcher as ConstructorType<Error>)
      }
    } catch {
      // If accessing prototype throws, it's not a constructor
    }
    return (matcher as ErrorValidator | ErrorTypeGuard<TError>)(error)
  }
  return false
}

const shouldCatchError = <TError extends Error>(shouldCatch: ShouldCatch<TError>, error: Error): boolean => {
  if (Array.isArray(shouldCatch)) {
    return (shouldCatch as readonly ErrorMatcher<TError>[]).some((matcher: ErrorMatcher<TError>) =>
      matchError<TError>(matcher, error)
    )
  }
  return matchError<TError>(shouldCatch as ErrorMatcher<TError>, error)
}

export type ErrorBoundaryProps<TShouldCatch extends ShouldCatch = ShouldCatch> = PropsWithChildren<{
  /**
   * an array of elements for the ErrorBoundary to check each render. If any of those elements change between renders, then the ErrorBoundary will reset the state which will re-render the children
   */
  resetKeys?: unknown[]
  /**
   * when ErrorBoundary is reset by resetKeys or fallback's props.reset, onReset will be triggered
   */
  onReset?: () => void
  /**
   * when ErrorBoundary catch error, onError will be triggered
   */
  onError?: (error: InferError<TShouldCatch>, info: ErrorInfo) => void
  /**
   * when ErrorBoundary catch error, fallback will be render instead of children
   */
  fallback: ReactNode | FunctionComponent<ErrorBoundaryFallbackProps<InferError<TShouldCatch>>>
  /**
   * determines whether the ErrorBoundary should catch errors based on conditions
   * @default true
   */
  shouldCatch?: TShouldCatch
}>

type ErrorBoundaryState<TError extends Error = Error> =
  | { isError: true; error: TError }
  | { isError: false; error: null }

const initialErrorBoundaryState: ErrorBoundaryState = {
  isError: false,
  error: null,
}

class BaseErrorBoundary<TShouldCatch extends ShouldCatch = ShouldCatch> extends Component<
  ErrorBoundaryProps<TShouldCatch>,
  ErrorBoundaryState
> {
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { isError: true, error }
  }

  state = initialErrorBoundaryState

  componentDidUpdate(
    prevProps: ErrorBoundaryProps<TShouldCatch>,
    prevState: ErrorBoundaryState<InferError<TShouldCatch>>
  ) {
    const { isError } = this.state
    const { resetKeys } = this.props
    if (isError && prevState.isError && hasResetKeysChanged(prevProps.resetKeys, resetKeys)) {
      this.reset()
    }
  }

  componentDidCatch(error: InferError<TShouldCatch>, info: ErrorInfo) {
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
      if (error instanceof SuspensiveError) {
        throw error
      }
      if (error instanceof ErrorInFallback) {
        throw error.originalError
      }
      if (!shouldCatchError<InferError<TShouldCatch>>(shouldCatch as ShouldCatch<InferError<TShouldCatch>>, error)) {
        throw error
      }

      if (typeof fallback === 'undefined') {
        if (process.env.NODE_ENV === 'development') {
          console.error('ErrorBoundary of @suspensive/react requires a defined fallback')
        }
        throw error
      }

      const Fallback = fallback
      childrenOrFallback = (
        <FallbackBoundary>
          {typeof Fallback === 'function' ? (
            <Fallback error={error as InferError<TShouldCatch>} reset={this.reset} />
          ) : (
            Fallback
          )}
        </FallbackBoundary>
      )
    }

    return (
      <ErrorBoundaryContext.Provider value={{ ...this.state, reset: this.reset }}>
        {childrenOrFallback}
      </ErrorBoundaryContext.Provider>
    )
  }
}

class ErrorInFallback extends Error {
  originalError: Error
  constructor(originalError: Error) {
    super()
    this.originalError = originalError
  }
}

class FallbackBoundary extends Component<{ children: ReactNode }> {
  componentDidCatch(originalError: Error) {
    throw originalError instanceof SuspensiveError ? originalError : new ErrorInFallback(originalError)
  }
  render() {
    return this.props.children
  }
}

/**
 * This component provides a simple and reusable wrapper that you can use to wrap around your components. Any rendering errors in your components hierarchy can then be gracefully handled.
 * @see {@link https://suspensive.org/docs/react/ErrorBoundary Suspensive Docs}
 */
export const ErrorBoundary = Object.assign(
  forwardRef(function ErrorBoundary<TShouldCatch extends ShouldCatch = ShouldCatch>(
    props: ErrorBoundaryProps<TShouldCatch>,
    ref: ForwardedRef<ErrorBoundaryHandle>
  ) {
    const { fallback, children, onError, onReset, resetKeys, shouldCatch } = props
    const group = useContext(ErrorBoundaryGroupContext) ?? { resetKey: 0 }
    const baseErrorBoundaryRef = useRef<BaseErrorBoundary<TShouldCatch>>(null)
    useImperativeHandle(ref, () => ({
      reset: () => baseErrorBoundaryRef.current?.reset(),
    }))

    return (
      <BaseErrorBoundary<TShouldCatch>
        shouldCatch={shouldCatch}
        fallback={fallback}
        onError={onError}
        onReset={onReset}
        resetKeys={[group.resetKey, ...(resetKeys || [])]}
        ref={baseErrorBoundaryRef}
      >
        {children}
      </BaseErrorBoundary>
    )
  }) as {
    <TShouldCatch extends ShouldCatch = ShouldCatch>(
      props: ErrorBoundaryProps<TShouldCatch> & React.RefAttributes<ErrorBoundaryHandle>
    ): ReturnType<ForwardRefExoticComponent<ErrorBoundaryProps>>
  },
  {
    displayName: 'ErrorBoundary',
    with: <TProps extends ComponentProps<ComponentType> = Record<string, never>>(
      errorBoundaryProps: PropsWithoutChildren<ErrorBoundaryProps> = { fallback: undefined },
      Component: ComponentType<TProps>
    ) =>
      Object.assign(
        (props: TProps) => (
          <ErrorBoundary {...errorBoundaryProps}>
            <Component {...props} />
          </ErrorBoundary>
        ),
        { displayName: `ErrorBoundary.with(${Component.displayName || Component.name || 'Component'})` }
      ),
    Consumer: ({ children }: { children: (errorBoundary: ReturnType<typeof useErrorBoundary>) => ReactNode }) => (
      <>{children(useErrorBoundary())}</>
    ),
  }
)

const ErrorBoundaryContext = Object.assign(createContext<(ErrorBoundaryHandle & ErrorBoundaryState) | null>(null), {
  displayName: 'ErrorBoundaryContext',
})

/**
 * This hook provides a simple and reusable wrapper that you can use to wrap around your components. Any rendering errors in your components hierarchy can then be gracefully handled.
 * @see {@link https://suspensive.org/docs/react/ErrorBoundary#useerrorboundary Suspensive Docs}
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const useErrorBoundary = <TError extends Error = Error>() => {
  const [state, setState] = useState<ErrorBoundaryState<TError>>({
    isError: false,
    error: null,
  })
  if (state.isError) {
    throw state.error
  }

  const errorBoundary = useContext(ErrorBoundaryContext)
  SuspensiveError.assert(
    errorBoundary != null && !errorBoundary.isError,
    Message_useErrorBoundary_this_hook_should_be_called_in_ErrorBoundary_props_children
  )

  return useMemo(
    () => ({
      setError: (error: TError) => setState({ isError: true, error }),
    }),
    []
  )
}

/**
 * This hook allows you to access the reset method and error objects without prop drilling.
 * @see {@link https://suspensive.org/docs/react/ErrorBoundary#useerrorboundaryfallbackprops Suspensive Docs}
 */
export const useErrorBoundaryFallbackProps = <TError extends Error = Error>(): ErrorBoundaryFallbackProps<TError> => {
  const errorBoundary = useContext(ErrorBoundaryContext)
  SuspensiveError.assert(
    errorBoundary != null && errorBoundary.isError,
    Message_useErrorBoundaryFallbackProps_this_hook_should_be_called_in_ErrorBoundary_props_fallback
  )

  return useMemo(
    () => ({
      error: errorBoundary.error as TError,
      reset: errorBoundary.reset,
    }),
    [errorBoundary.error, errorBoundary.reset]
  )
}
