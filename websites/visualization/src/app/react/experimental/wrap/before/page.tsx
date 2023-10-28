'use client'
import { ErrorBoundary, ErrorBoundaryGroup, Suspense, useErrorBoundary, wrap } from '@suspensive/react'
import { UseSuspenseQuery } from '~/components'
import { api } from '~/utils'

const logError = (error: Error) => console.error(error)

export default wrap(ErrorBoundaryGroup, { blockOutside: false })(
  wrap(ErrorBoundary, { fallback: (props) => <>{props.error.message}</>, onError: logError })(
    wrap(Suspense, { fallback: <>loading...</> })(() => {
      const errorBoundary = useErrorBoundary()

      return (
        <>
          <button onClick={() => errorBoundary.setError(new Error('trigger error by useErrorBoundary().setError'))}>
            trigger error by useErrorBoundary().setError
          </button>
          <UseSuspenseQuery queryKey={['with', 1] as const} queryFn={() => api.delay(200, { percentage: 50 })} />
        </>
      )
    })
  )
)
