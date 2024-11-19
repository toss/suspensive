'use client'

import { ErrorBoundary, Suspense } from '@suspensive/react'
import { FadeIn } from '@suspensive/react-dom'
import { SuspenseQuery, queryOptions } from '@suspensive/react-query'
import axios from 'axios'
import { delay } from '~/utils'

const query = {
  user: (userId: number) =>
    queryOptions({
      queryKey: ['users', userId],
      queryFn: () =>
        delay(3000).then(() =>
          axios
            .get<{
              id: number
              username: string
              maidenName: string
              age: number
              gender: string
              email: string
              image: 'https://dummyjson.com/icon/emilys/128'
              userAgent: string
            }>(`https://dummyjson.com/users/${userId}`)
            .then(({ data }) => data)
        ),
    }),
}

export default function Page() {
  return (
    <div>
      <ErrorBoundary fallback={({ error }) => <>{error.message}</>}>
        {Array.from({ length: 20 }).map((_, i) => {
          const userId = i + 1
          return (
            <Suspense
              key={userId}
              clientOnly
              fallback={
                <FadeIn delay={200} duration={1000} inViewOptions={{ triggerOnce: true }}>
                  {skeleton}
                </FadeIn>
              }
            >
              <SuspenseQuery {...query.user(userId)}>
                {({ data: user }) => (
                  <FadeIn duration={200} className="max-w-[344px]">
                    <h1 className="text-lg font-bold">{user.username}</h1>
                    <p className="text-xs">{user.userAgent}</p>
                    <p>{user.age}</p>
                    <p>{user.maidenName}</p>
                    <div className="mb-6" />
                  </FadeIn>
                )}
              </SuspenseQuery>
            </Suspense>
          )
        })}
      </ErrorBoundary>
    </div>
  )
}

const skeleton = (
  <div role="status" className="mb-6 animate-pulse space-y-2">
    <div className="h-4 w-[42px] rounded-sm bg-gray-300 dark:bg-gray-600" />
    <div className="h-2 w-[34px] rounded-sm bg-gray-300 dark:bg-gray-600" />
    <div className="h-2 w-[344px] rounded-sm bg-gray-300 dark:bg-gray-600" />
    <div className="h-2 w-[344px] rounded-sm bg-gray-300 dark:bg-gray-600" />
    <div className="h-4 w-[42px] rounded-sm bg-gray-300 dark:bg-gray-600" />
    <div className="h-4 w-[34px] rounded-sm bg-gray-300 dark:bg-gray-600" />
  </div>
)
