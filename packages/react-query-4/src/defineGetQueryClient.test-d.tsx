import type { QueryClient } from '@tanstack/react-query'
import { defineGetQueryClient } from './defineGetQueryClient'

describe('getQueryClient', () => {
  it('type check', () => {
    const { getQueryClient } = defineGetQueryClient({ defaultOptions: { queries: { staleTime: 5000 } } })

    const queryClient = getQueryClient()
    expectTypeOf(queryClient).toEqualTypeOf<QueryClient>()

    const queryClientWithConfig = getQueryClient()
    expectTypeOf(queryClientWithConfig).toEqualTypeOf<QueryClient>()
  })
})
