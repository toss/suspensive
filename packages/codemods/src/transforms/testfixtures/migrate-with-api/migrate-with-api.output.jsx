import { ErrorBoundaryGroup, ErrorBoundary, Suspense } from '@suspensive/react';
import { useSuspenseQuery } from '@suspensive/react-query'

export const Case1 = ErrorBoundaryGroup.with({ blockOutside: false }, ErrorBoundary.with({
    fallback: ({ error }) => <>{error.message}</>,
    onError: logger.log,
  }, Suspense.with({ fallback: <>loading...</>, clientOnly: true }, () => {
    const query = useSuspenseQuery({
      queryKey: ['key'],
      queryFn: () => api.text(),
    })
    return <>{query.data.text}</>
  })))

export const Case2 = ErrorBoundary.with({
    fallback: ({ error }) => <>{error.message}</>,
    onError: logger.log,
  }, Suspense.with({}, (_props) => {
    const query = useSuspenseQuery({
      queryKey: ['key'],
      queryFn: () => api.text(),
    })
    return <>{query.data.text}</>
  }))

export const Case3 = Suspense.with({}, (_props) => {
    const query = useSuspenseQuery({
      queryKey: ['key'],
      queryFn: () => api.text(),
    })
    return <>{query.data.text}</>
  })
