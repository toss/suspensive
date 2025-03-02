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
      invalid_type_error: 'searchParam: id type should be number',
      required_error: 'searchParam: id is required',
    })
    .int('searchParam: id type should be integer')
    .min(1, 'searchParam: id type should be number bigger than 1'),
})
export default ErrorBoundary.wrap(
  {
    shouldCatch: ZodError,
    fallback: ({ error }) =>
      error instanceof ZodError ? (
        <div>
          zod error:
          {error.errors.map((error) => (
            <p key={error.code}>{error.message}</p>
          ))}
        </div>
      ) : null,
  },
  Suspense.wrap({ fallback: <Spinner /> }, () => {
    const searchParams = useSearchParams()
    const { id } = searchParamsSchema.parse(Object.fromEntries(searchParams.entries()))
    const userQuery = useSuspenseQuery({
      queryKey: ['users', id] as const,
      queryFn: ({ queryKey: [, userId] }) => delay(200).then(() => ({ id: userId, name: 'John' })),
    })

    return <div>page {userQuery.data.name}</div>
  })
)
