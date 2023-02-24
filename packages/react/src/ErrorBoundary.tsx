import {
  Component,
  ComponentPropsWithoutRef,
  ComponentType,
  ErrorInfo,
  PropsWithChildren,
  PropsWithRef,
  ReactNode,
  forwardRef,
  isValidElement,
  useContext,
  useImperativeHandle,
  useRef,
} from 'react'
import { ErrorBoundaryGroupContext } from './ErrorBoundaryGroup'
import { ComponentPropsWithoutChildren } from './types'
import { isDifferentArray } from './utils'

type ErrorBoundaryProps = PropsWithRef<
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
    fallback:
      | ReactNode
      | ((props: {
          /**
           * when ErrorBoundary catch error, you can use this error
           */
          error: Error
          /**
           * when you want to reset caught error, you can use this reset
           */
          reset: () => void
        }) => ReactNode)
  }>
>

type ErrorBoundaryState = {
  error: Error | null
}

const initialState: ErrorBoundaryState = {
  error: null,
}

class BaseErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  state = initialState

  componentDidUpdate(prevProps: ErrorBoundaryProps, prevState: ErrorBoundaryState) {
    const { error } = this.state
    const { resetKeys } = this.props

    if (error !== null && prevState.error !== null && isDifferentArray(prevProps.resetKeys, resetKeys)) {
      this.resetErrorBoundary()
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info)
  }

  resetErrorBoundary = () => {
    this.props.onReset?.()
    this.reset()
  }

  reset() {
    this.setState(initialState)
  }

  render() {
    const { error } = this.state
    const { children, fallback } = this.props

    if (error !== null) {
      if (isValidElement(fallback)) {
        return fallback
      }
      if (typeof fallback === 'function') {
        return fallback({
          error,
          reset: this.resetErrorBoundary,
        })
      }
      throw new Error('react-error-boundary requires either a fallback')
    }

    return children
  }
}

/**
 * This component provide a simple and reusable wrapper that you can use to wrap around your components. Any rendering errors in your components hierarchy can then be gracefully handled.
 * @see {@link https://suspensive.org/docs/react/src/ErrorBoundary.i18n Suspensive Official Docs}
 */
export const ErrorBoundary = forwardRef<{ reset(): void }, ComponentPropsWithoutRef<typeof BaseErrorBoundary>>(
  (props, resetRef) => {
    const group = useContext(ErrorBoundaryGroupContext)
    const resetKeys = group.resetKey ? [group.resetKey, ...(props.resetKeys || [])] : props.resetKeys

    const ref = useRef<BaseErrorBoundary>(null)
    useImperativeHandle(resetRef, () => ({
      reset: () => ref.current?.resetErrorBoundary(),
    }))

    return <BaseErrorBoundary {...props} resetKeys={resetKeys} ref={ref} />
  }
)
if (process.env.NODE_ENV !== 'production') {
  ErrorBoundary.displayName = 'ErrorBoundary'
}

export const withErrorBoundary = <Props extends Record<string, unknown> = Record<string, never>>(
  Component: ComponentType<Props>,
  errorBoundaryProps: ComponentPropsWithoutChildren<typeof ErrorBoundary>
) => {
  const Wrapped = (props: Props) => (
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
