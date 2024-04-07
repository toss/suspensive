'use client'

import { useErrorBoundary, wrap } from '@suspensive/react-query'

const logError = (error: Error) => console.error(error)

const Page = wrap
  .ErrorBoundaryGroup({ blockOutside: false })
  .ErrorBoundary({ fallback: (props) => <div>{props.error.message}</div>, onError: logError })
  .Suspense({ clientOnly: true, fallback: 'loading...' })
  .on(function Page({ text }: { text: string }) {
    const errorBoundary = useErrorBoundary()

    return (
      <div>
        <button onClick={() => errorBoundary.setError(new Error('trigger error by useErrorBoundary().setError'))}>
          trigger error by useErrorBoundary().setError
        </button>
        {text}
      </div>
    )
  })

export default Page
