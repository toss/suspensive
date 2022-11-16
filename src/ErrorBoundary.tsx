import { Component, ErrorInfo, isValidElement, PropsWithRef, ReactNode } from 'react'
import { isDifferentArray } from './utils'

type Props = PropsWithRef<{
  resetKeys?: unknown[]
  onReset?(): void
  onError?(error: Error, info: ErrorInfo): void
  children?: ReactNode | undefined
  fallback: ReactNode | ((props: { error: Error; reset: (...args: unknown[]) => void }) => ReactNode)
}>

interface State {
  error: Error | null
}

const initialState: State = {
  error: null,
}

export class ErrorBoundary extends Component<Props, State> {
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
      } else if (typeof fallback === 'function') {
        return fallback({
          error,
          reset: this.resetErrorBoundary,
        })
      } else {
        throw new Error('react-error-boundary requires either a fallback')
      }
    }

    return children
  }
}
