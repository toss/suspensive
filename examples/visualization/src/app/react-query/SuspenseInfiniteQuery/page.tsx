'use client'

import { ErrorBoundary, Suspense } from '@suspensive/react'
import { SuspenseInfiniteQuery } from '@suspensive/react-query'
import axios from 'axios'
import { Spinner } from '~/components/uis'

export default function Page() {
  const authorId = 0
  return (
    <ErrorBoundary fallback={({ error }) => <>{error.message}</>}>
      <Suspense clientOnly fallback={<Spinner />}>
        <SuspenseInfiniteQuery
          queryKey={['users', authorId]}
          queryFn={({ pageParam }) => {
            const { limit, skip } = (pageParam ?? { limit: 5, skip: undefined }) as { limit: number; skip?: number }
            return axios
              .get<{
                limit: number
                skip: number
                total: number
                products: Array<{
                  id: number
                  title: string
                  price: number
                }>
              }>(`https://dummyjson.com/products?limit=${limit}${skip ? `&skip=${skip}` : ''}&select=title,price`)
              .then(({ data }) => ({
                data,
                pageParam: {
                  limit: data.limit,
                  skip: data.limit,
                },
              }))
          }}
          getNextPageParam={(lastPage) => lastPage.pageParam}
        >
          {({ data, fetchNextPage, hasNextPage, isFetchingNextPage }) => (
            <div>
              {data.pages.map(({ data }) =>
                data.products.map((product) => (
                  // eslint-disable-next-line @eslint-react/no-duplicate-key
                  <div key={product.id}>
                    <h2>title: {product.title}</h2>
                    <p>price: {product.price}</p>
                    <p>id: {product.id}</p>
                  </div>
                ))
              )}
              {hasNextPage ? (
                isFetchingNextPage ? (
                  <Spinner />
                ) : (
                  <button
                    disabled={isFetchingNextPage}
                    onClick={() => {
                      fetchNextPage({
                        pageParam: {
                          limit: data.pages[data.pages.length - 1].data.limit,
                          skip: data.pages[data.pages.length - 1].data.skip + 5,
                        },
                      })
                    }}
                  >
                    load more
                  </button>
                )
              ) : null}
            </div>
          )}
        </SuspenseInfiniteQuery>
      </Suspense>
    </ErrorBoundary>
  )
}
