'use client'

import {
  ErrorBoundary,
  type ErrorBoundaryFallbackProps,
  useErrorBoundary,
  useErrorBoundaryFallbackProps,
} from '@suspensive/react'
import { type PropsWithChildren, useEffect, useState } from 'react'

function ErrorBoundaryFallback({ error }: ErrorBoundaryFallbackProps) {
  const props = useErrorBoundaryFallbackProps()

  return (
    <button type="button" onClick={props.reset}>
      reset: {error.message}
    </button>
  )
}

function ErrorComponent() {
  const errorBoundary = useErrorBoundary()

  return (
    <ThrowError message="error message set by ThrowError" after={2000}>
      No Error{' '}
      <button type="button" onClick={() => errorBoundary.setError(new Error('error message set by useErrorBoundary'))}>
        setError by useErrorBoundary
      </button>
    </ThrowError>
  )
}

export default function Page() {
  return (
    <ErrorBoundary fallback={ErrorBoundaryFallback}>
      <ErrorComponent />
    </ErrorBoundary>
  )
}

type ThrowErrorProps = PropsWithChildren<{ message: string; after: number }>
const ThrowError = ({ message, after, children }: ThrowErrorProps) => {
  const [isNeedError, setIsNeedError] = useState(false)
  console.log('ThrowError', isNeedError)
  if (isNeedError) {
    throw new Error(message)
  }
  useEffect(() => {
    const timeoutId = setTimeout(() => setIsNeedError(true), after)
    return () => clearTimeout(timeoutId)
  }, [after])
  return <>{children}</>
}
