import {
  Component,
  type ComponentProps,
  type ComponentType,
  type ErrorInfo,
  type ForwardedRef,
  type FunctionComponent,
  type PropsWithChildren,
  type ReactNode,
  createContext,
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
import { genericForwardRef } from './utils/genericForwardRef'
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

type ShouldCatchItemErrorValidationCallback = (error: Error) => boolean
type ShouldCatchItemErrorAssertionCallback<TError extends Error> = (error: Error) => error is TError

type ShouldCatchItem =
  | ConstructorType<Error>
  | ShouldCatchItemErrorValidationCallback
  | ShouldCatchItemErrorAssertionCallback<Error>
  | boolean

const checkErrorBoundary = (shouldCatchItem: ShouldCatchItem, error: Error) => {
  if (typeof shouldCatchItem === 'boolean') {
    return shouldCatchItem
  }
  if (shouldCatchItem.prototype instanceof Error) {
    return error instanceof shouldCatchItem
  }
  return (
    shouldCatchItem as
      | ShouldCatchItemErrorValidationCallback
      | ShouldCatchItemErrorAssertionCallback<InferError<ShouldCatchItem>>
  )(error)
}

type ShouldCatch = ShouldCatchItem | [ShouldCatchItem, ...ShouldCatchItem[]]
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

const initialErrorBoundaryState = <TError extends Error>(): ErrorBoundaryState<TError> => ({
  isError: false,
  error: null,
})

class BaseErrorBoundary<TShouldCatch extends ShouldCatch = ShouldCatch> extends Component<
  ErrorBoundaryProps<TShouldCatch>,
  ErrorBoundaryState<InferError<TShouldCatch>>
> {
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { isError: true, error }
  }

  state = initialErrorBoundaryState<InferError<TShouldCatch>>()

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
    this.setState(initialErrorBoundaryState<InferError<TShouldCatch>>())
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
      const isCatch = Array.isArray(shouldCatch)
        ? shouldCatch.some((shouldCatchItem) => checkErrorBoundary(shouldCatchItem, error))
        : checkErrorBoundary(shouldCatch, error)
      if (!isCatch) {
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
          {typeof Fallback === 'function' ? <Fallback error={error} reset={this.reset} /> : Fallback}
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
  genericForwardRef(function ErrorBoundary<TShouldCatch extends ShouldCatch = ShouldCatch>(
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
  }),
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

type InferErrorFromShouldCatchItem<T> =
  T extends ConstructorType<infer TClass>
    ? TClass extends Error
      ? TClass
      : never
    : T extends ShouldCatchItemErrorAssertionCallback<infer TError>
      ? TError extends Error
        ? TError
        : never
      : never

type InferErrorFromArrayOf<TShouldCatch extends readonly ShouldCatchItem[]> = TShouldCatch extends readonly [
  infer TFirst,
  ...infer TRest,
]
  ? TRest extends readonly ShouldCatchItem[]
    ? InferErrorFromShouldCatchItem<TFirst> | InferErrorFromArrayOf<TRest>
    : InferErrorFromShouldCatchItem<TFirst>
  : never

type IsInferableArrayOf<TShouldCatch extends readonly ShouldCatchItem[]> = TShouldCatch extends readonly []
  ? true
  : TShouldCatch extends readonly [infer TFirst, ...infer TRest]
    ? TRest extends readonly ShouldCatchItem[]
      ? TFirst extends ConstructorType<Error> | ShouldCatchItemErrorAssertionCallback<Error>
        ? IsInferableArrayOf<TRest>
        : false
      : TFirst extends ConstructorType<Error> | ShouldCatchItemErrorAssertionCallback<Error>
        ? true
        : false
    : false

// Main InferError type
type InferError<TShouldCatch extends ShouldCatch> =
  TShouldCatch extends ConstructorType<infer TClass>
    ? TClass extends Error
      ? TClass
      : Error
    : TShouldCatch extends ShouldCatchItemErrorAssertionCallback<infer TError>
      ? TError extends Error
        ? TError
        : Error
      : TShouldCatch extends readonly ShouldCatchItem[]
        ? IsInferableArrayOf<TShouldCatch> extends true
          ? InferErrorFromArrayOf<TShouldCatch> extends never
            ? Error
            : InferErrorFromArrayOf<TShouldCatch>
          : Error
        : Error
