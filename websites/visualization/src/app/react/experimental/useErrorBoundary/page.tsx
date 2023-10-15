'use client'

import { ErrorBoundary, useErrorBoundary } from '@suspensive/react'
import type { PropsWithChildren } from 'react'
import { createElement, useEffect, useState } from 'react'

export default function Page() {
  return (
    <ErrorBoundary
      fallback={function ErrorBoundaryFallback({ error }) {
        const errorBoundary = useErrorBoundary()

        return <button onClick={() => errorBoundary.reset()}>reset: {error.message}</button>
      }}
    >
      {createElement(function ErrorComponent() {
        const errorBoundary = useErrorBoundary()

        return (
          <ThrowError message="error message set by ThrowError" after={2000}>
            No Error{' '}
            <button onClick={() => errorBoundary.setError(new Error('error message set by useErrorBoundary'))}>
              setError by useErrorBoundary
            </button>
          </ThrowError>
        )
      })}
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
