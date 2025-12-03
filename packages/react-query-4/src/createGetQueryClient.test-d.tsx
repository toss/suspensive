import type { QueryClient } from '@tanstack/react-query'
import { createGetQueryClient } from './createGetQueryClient'

describe('getQueryClient', () => {
  it('type check', () => {
    const { getQueryClient } = createGetQueryClient({ defaultOptions: { queries: { staleTime: 5000 } } })

    const queryClient = getQueryClient()
    expectTypeOf(queryClient).toEqualTypeOf<QueryClient>()

    const queryClientWithConfig = getQueryClient()
    expectTypeOf(queryClientWithConfig).toEqualTypeOf<QueryClient>()
  })
})
