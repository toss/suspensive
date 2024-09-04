'use client'

import { ErrorBoundary, Suspense } from '@suspensive/react'
import { SuspenseQuery } from '@suspensive/react-query'
import axios from 'axios'
import { Spinner } from '~/components/uis'

export default function Page() {
  const userId = 1

  return (
    <ErrorBoundary fallback={({ error }) => <>{error.message}</>}>
      <Suspense clientOnly fallback={<Spinner />}>
        <div>
          <SuspenseQuery
            queryKey={['users', userId]}
            queryFn={() =>
              axios
                .get<{
                  id: number
                  username: string
                  age: number
                }>(`https://dummyjson.com/users/${userId}`)
                .then(({ data }) => data)
            }
          >
            {({ data: user }) => <h1>{user.username}</h1>}
          </SuspenseQuery>
          <SuspenseQuery
            queryKey={['products']}
            queryFn={() =>
              axios
                .get<{
                  products: Array<{
                    id: number
                    title: string
                    price: number
                  }>
                }>(`https://dummyjson.com/products`)
                .then(({ data }) => data)
            }
            select={(data) => data.products}
          >
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
