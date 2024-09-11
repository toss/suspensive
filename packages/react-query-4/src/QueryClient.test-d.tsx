import { QueryClient as TanStackQueryClient } from '@tanstack/react-query'
import { type ReactNode, createContext } from 'react'
import { QueryClient } from './QueryClient'

const customReactQueryContext = createContext<TanStackQueryClient | undefined>(new TanStackQueryClient())

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
      <QueryClient context={customReactQueryContext}>
        {(queryClient) => {
          expectTypeOf(queryClient).toEqualTypeOf<TanStackQueryClient>()
          return <></>
        }}
      </QueryClient>
    )
    expectTypeOf(<QueryClient>{() => <></>}</QueryClient>).toEqualTypeOf<JSX.Element>()
    expectTypeOf(<QueryClient>{() => <></>}</QueryClient>).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(
      <QueryClient context={customReactQueryContext}>{() => <></>}</QueryClient>
    ).toEqualTypeOf<JSX.Element>()
    expectTypeOf(
      <QueryClient context={customReactQueryContext}>{() => <></>}</QueryClient>
    ).not.toEqualTypeOf<ReactNode>()
  })
})
