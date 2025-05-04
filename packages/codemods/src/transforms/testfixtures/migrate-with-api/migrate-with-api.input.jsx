import { wrap } from '@suspensive/react'
import { useSuspenseQuery } from '@suspensive/react-query'

export const Case1 = wrap
  .ErrorBoundaryGroup({ blockOutside: false })
  .ErrorBoundary({
    fallback: ({ error }) => <>{error.message}</>,
    onError: logger.log,
  })
  .Suspense({ fallback: <>loading...</>, clientOnly: true })
  .on(() => {
    const query = useSuspenseQuery({
      queryKey: ['key'],
      queryFn: () => api.text(),
    })
    return <>{query.data.text}</>
  })

export const Case2 = wrap
  .ErrorBoundary({
    fallback: ({ error }) => <>{error.message}</>,
    onError: logger.log,
  })
  .Suspense()
  .on((_props) => {
    const query = useSuspenseQuery({
      queryKey: ['key'],
      queryFn: () => api.text(),
    })
    return <>{query.data.text}</>
  })

export const Case3 = wrap
  .Suspense()
  .on((_props) => {
    const query = useSuspenseQuery({
      queryKey: ['key'],
      queryFn: () => api.text(),
    })
    return <>{query.data.text}</>
  })
