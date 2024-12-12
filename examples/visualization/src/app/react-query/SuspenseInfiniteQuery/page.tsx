'use client'

import { ErrorBoundary, Suspense } from '@suspensive/react'
import { SuspenseInfiniteQuery } from '@suspensive/react-query-5'
import axios from 'axios'
import { Spinner } from '~/components/uis'

export default function Page() {
  const authorId = 0
  return (
    <ErrorBoundary fallback={({ error }) => <>{error.message}</>}>
      <Suspense clientOnly fallback={<Spinner />}>
        <SuspenseInfiniteQuery
          queryKey={['users', authorId]}
          queryFn={({ pageParam }) =>
            axios
              .get<{
                limit: number
                skip: number
                total: number
                products: Array<{ id: number; title: string; price: number }>
              }>(
                `https://dummyjson.com/products?limit=${pageParam.limit}${pageParam.skip ? `&skip=${pageParam.skip}` : ''}&select=title,price`
              )
              .then(({ data }) => data)
          }
          initialPageParam={{ limit: 5, skip: undefined } as { limit: number; skip: number | undefined }}
          getNextPageParam={(lastPage) => ({ limit: 5, skip: lastPage.skip + 5 })}
        >
          {({ data, fetchNextPage, hasNextPage, isFetchingNextPage }) => (
            <div>
              {data.pages.map((page) =>
                page.products.map((product) => (
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
                    type="button"
                    disabled={isFetchingNextPage}
                    onClick={() => {
                      fetchNextPage({})
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
