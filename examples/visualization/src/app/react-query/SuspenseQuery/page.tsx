'use client'

import { ErrorBoundary, Suspense } from '@suspensive/react'
import { SuspenseQuery } from '@suspensive/react-query-5'
import { queryOptions, usePrefetchQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Spinner } from '~/components/uis'

const query = {
  user: (userId: number) =>
    queryOptions({
      queryKey: ['users', userId],
      queryFn: () =>
        axios
          .get<{
            id: number
            username: string
            age: number
          }>(`https://dummyjson.com/users/${userId}`)
          .then(({ data }) => data),
    }),
  products: () =>
    queryOptions({
      queryKey: ['products'],
      queryFn: () =>
        axios
          .get<{
            products: Array<{
              id: number
              title: string
              price: number
            }>
          }>(`https://dummyjson.com/products`)
          .then(({ data }) => data),
    }),
}

export default function Page() {
  const userId = 1
  usePrefetchQuery(query.user(userId))
  usePrefetchQuery(query.products())

  return (
    <ErrorBoundary fallback={({ error }) => <>{error.message}</>}>
      <Suspense clientOnly fallback={<ExpensiveSpinner ms={2000} />}>
        <div>
          <SuspenseQuery {...query.user(userId)}>{({ data: user }) => <h1>{user.username}</h1>}</SuspenseQuery>
          <SuspenseQuery {...query.products()} select={(data) => data.products}>
            {({ data: products }) => (
              <div>
                {products.map((product) => (
                  <li key={product.id}>{product.title}</li>
                ))}
              </div>
            )}
          </SuspenseQuery>
        </div>
      </Suspense>
    </ErrorBoundary>
  )
}

const ExpensiveSpinner = ({ ms }: { ms: number }) => {
  if (typeof window !== 'undefined') {
    const start = Date.now()
    while (Date.now() - start < ms) {}
  }
  return <Spinner />
}
