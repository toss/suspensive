'use client'

import { ErrorBoundary, Suspense } from '@suspensive/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { ZodError, z } from 'zod'
import { Spinner } from '~/components/uis'
import { delay } from '~/utils'

const searchParamsSchema = z.object({
  id: z.coerce
    .number({
      error: (issue) =>
        issue.input === undefined ? 'searchParam: id is required' : 'searchParam: id type should be number',
    })
    .int('searchParam: id type should be integer')
    .min(1, 'searchParam: id type should be number bigger than 1'),
})
export default ErrorBoundary.with(
  {
    shouldCatch: ZodError,
    fallback: ({ error }) => (
      <div>
        zod error:
        {error.issues.map((issue) => (
          <p key={issue.code}>{issue.message}</p>
        ))}
      </div>
    ),
  },
  Suspense.with({ fallback: <Spinner /> }, () => {
    const searchParams = useSearchParams()
    const { id } = searchParamsSchema.parse(Object.fromEntries(searchParams.entries()))
    const userQuery = useSuspenseQuery({
      queryKey: ['users', id] as const,
      queryFn: ({ queryKey: [, userId] }) => delay(200).then(() => ({ id: userId, name: 'John' })),
    })

    return <div>page {userQuery.data.name}</div>
  })
)
