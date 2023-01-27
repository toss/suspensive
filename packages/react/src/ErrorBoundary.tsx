import {
  Component,
  ComponentPropsWithoutRef,
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
import { isDevelopment, isDifferentArray } from './utils'

type Props = PropsWithRef<
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

type State = {
  error: Error | null
}

const initialState: State = {
  error: null,
}

class BaseErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  state = initialState

  resetErrorBoundary = () => {
    this.props.onReset?.()
    this.reset()
  }

  reset() {
    this.setState(initialState)
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info)
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { error } = this.state
    const { resetKeys } = this.props

    if (error !== null && prevState.error !== null && isDifferentArray(prevProps.resetKeys, resetKeys)) {
      this.resetErrorBoundary()
    }
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
 * @see {@link https://docs.suspensive.org/docs/react/src/ErrorBoundary.i18n Suspensive Official Docs}
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
if (isDevelopment) {
  ErrorBoundary.displayName = 'ErrorBoundary'
}
