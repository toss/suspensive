import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import Link from 'next/link'
import { PageClientComponent } from './PageClientComponent'
import { query } from '~/query'
import { getQueryClient } from '~/react-query'

export default async function MyPage() {
  const queryClient = getQueryClient()
  await Promise.all([
    queryClient.prefetchQuery(query.text(100)),
    queryClient.prefetchQuery(query.text(200)),
    queryClient.prefetchQuery(query.text(300)),
    queryClient.prefetchQuery(query.text(400)),
  ])

  const data = queryClient.getQueryData(query.text(100).queryKey)
  console.log(data)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Link href="/test">to test page</Link>
      <PageClientComponent />
    </HydrationBoundary>
  )
}
