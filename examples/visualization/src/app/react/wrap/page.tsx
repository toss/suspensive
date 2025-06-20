'use client'

import { ErrorBoundary, ErrorBoundaryGroup, Suspense, useErrorBoundary } from '@suspensive/react'

const logError = (error: Error) => console.error(error)

export default ErrorBoundaryGroup.with(
  { blockOutside: false },
  ErrorBoundary.with(
    { fallback: (props) => <div>{props.error.message}</div>, onError: logError },
    Suspense.with({ clientOnly: true, fallback: 'loading...' }, ({ text }: { text: string }) => {
      const errorBoundary = useErrorBoundary()

      return (
        <div>
          <button
            type="button"
            onClick={() => errorBoundary.setError(new Error('trigger error by useErrorBoundary().setError'))}
          >
            trigger error by useErrorBoundary().setError
          </button>
          {text}
        </div>
      )
    })
  )
)
