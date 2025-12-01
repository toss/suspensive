import type { QueryClient } from '@tanstack/react-query'
import { getQueryClient } from './getQueryClient'

describe('getQueryClient', () => {
  it('type check', () => {
    const queryClient = getQueryClient()
    expectTypeOf(queryClient).toEqualTypeOf<QueryClient>()

    const queryClientWithConfig = getQueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5000,
        },
      },
    })
    expectTypeOf(queryClientWithConfig).toEqualTypeOf<QueryClient>()
  })
})
