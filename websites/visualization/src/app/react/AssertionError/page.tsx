'use client'
import { AssertionError, ErrorBoundary, Suspense } from '@suspensive/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Area, Button } from '~/components/uis'

export default function Page() {
  const router = useRouter()

  return (
    <ErrorBoundary
      fallback={({ error, reset }) => (
        <>
          Root: {error.message} <Button onClick={reset}>↻</Button>
        </>
      )}
    >
      <Area title="RootErrorBoundary">
        <Area title="query-string controls">
          <button onClick={() => router.push('/react/AssertionError?id=virtual-id')}>id: O</button>
          <button onClick={() => router.push('/react/AssertionError')}>id: X</button>
        </Area>
        <ErrorBoundary
          fallback={({ error, reset }) => (
            <>
              Parent: {error.message} <Button onClick={reset}>↻</Button>
            </>
          )}
        >
          <Area title="ParentErrorBoundary">
            <ErrorBoundary
              shouldCatch={AssertionError}
              fallback={({ error, reset }) => (
                <>
                  query parameters are required {error.message} <Button onClick={reset}>↻</Button>
                </>
              )}
            >
              <Suspense>
                <Component />
              </Suspense>
            </ErrorBoundary>
          </Area>
        </ErrorBoundary>
      </Area>
    </ErrorBoundary>
  )
}

const Component = () => {
  const id = useSearchParams().get('id')
  AssertionError.assert(typeof id === 'string', 'params.id should be string')

  const [isError, setIsError] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => setIsError(true), 2000)
    return () => clearTimeout(timeout)
  }, [])

  if (isError) {
    throw new Error('This should be shown in Parent ErrorBoundary')
  }

  return <Area title="ChildErrorBoundary">{id}: this component will throw Error</Area>
}
