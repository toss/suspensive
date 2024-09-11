import { QueryClient as TanStackQueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { QueryClient } from './QueryClient'

const queryClient = new TanStackQueryClient()

describe('<QueryClient/>', () => {
  it('type check', () => {
    ;() => (
      <QueryClient>
        {(queryClient) => {
          expectTypeOf(queryClient).toEqualTypeOf<TanStackQueryClient>()
          return <></>
        }}
      </QueryClient>
    )
    ;() => (
      <QueryClient queryClient={queryClient}>
        {(queryClient) => {
          expectTypeOf(queryClient).toEqualTypeOf<TanStackQueryClient>()
          return <></>
        }}
      </QueryClient>
    )
    expectTypeOf(<QueryClient>{() => <></>}</QueryClient>).toEqualTypeOf<JSX.Element>()
    expectTypeOf(<QueryClient>{() => <></>}</QueryClient>).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(<QueryClient queryClient={queryClient}>{() => <></>}</QueryClient>).toEqualTypeOf<JSX.Element>()
    expectTypeOf(<QueryClient queryClient={queryClient}>{() => <></>}</QueryClient>).not.toEqualTypeOf<ReactNode>()
  })
})
