'use client'
import { useErrorBoundary, withErrorBoundary, withErrorBoundaryGroup, withSuspense } from '@suspensive/react'
import { UseSuspenseQuery } from '~/components'
import { api } from '~/utils'

const logError = (error: Error) => console.error(error)

export default withErrorBoundaryGroup(
  withErrorBoundary(
    withSuspense.CSROnly(
      () => {
        const errorBoundary = useErrorBoundary()

        return (
          <>
            <button onClick={() => errorBoundary.setError(new Error('trigger error by useErrorBoundary().setError'))}>
              trigger error by useErrorBoundary().setError
            </button>
            <UseSuspenseQuery queryKey={['wrap', 1] as const} queryFn={() => api.delay(200, { percentage: 50 })} />
          </>
        )
      },
      { fallback: <>loading...</> }
    ),
    { fallback: (props) => <>{props.error.message}</>, onError: logError }
  ),
  { blockOutside: false }
)
