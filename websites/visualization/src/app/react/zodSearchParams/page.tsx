'use client'

import { wrap } from '@suspensive/react'
import { useSuspenseQuery } from '@suspensive/react-query'
import { useSearchParams } from 'next/navigation'
import { ZodError, z } from 'zod'
import { delay } from '~/utils'

export default wrap
  .ErrorBoundary({
    shouldCatch: ZodError,
    fallback: ({ error }) => {
      if (error instanceof ZodError) {
        return (
          <div>
            zod error:
            {error.errors.map((error) => (
              <div key={error.code}>{error.message}</div>
            ))}
          </div>
        )
      }
      throw new Error('ErrorBoundary should catch but cannot catch error of children')
    },
  })
  .Suspense({
    fallback: 'loading...',
  })
  .on(() => {
    const searchParams = useSearchParams()
    const id = z.coerce
      .number({
        invalid_type_error: 'searchParam: id type should be number',
        required_error: 'searchParam: id is required',
      })
      .int('searchParam: id type should be integer')
      .min(1, 'searchParam: id type should be number bigger than 1')
      .parse(searchParams.get('id'))

    const userQuery = useSuspenseQuery({
      queryKey: ['users', id] as const,
      queryFn: ({ queryKey: [, userId] }) => delay(200).then(() => ({ id: userId, name: 'John' })),
    })

    return <div>page {userQuery.data.name}</div>
  })
