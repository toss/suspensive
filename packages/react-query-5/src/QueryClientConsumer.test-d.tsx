import { QueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { QueryClientConsumer } from './QueryClientConsumer'

const queryClient = new QueryClient()

describe('<QueryClientConsumer/>', () => {
  it('type check', () => {
    ;(() => (
      <QueryClientConsumer>
        {(queryClient) => {
          expectTypeOf(queryClient).toEqualTypeOf<QueryClient>()
          return <></>
        }}
      </QueryClientConsumer>
    ))()
    ;(() => (
      <QueryClientConsumer queryClient={queryClient}>
        {(queryClient) => {
          expectTypeOf(queryClient).toEqualTypeOf<QueryClient>()
          return <></>
        }}
      </QueryClientConsumer>
    ))()
    expectTypeOf(<QueryClientConsumer>{() => <></>}</QueryClientConsumer>).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(<QueryClientConsumer>{() => <></>}</QueryClientConsumer>).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(
      <QueryClientConsumer queryClient={queryClient}>{() => <></>}</QueryClientConsumer>
    ).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(
      <QueryClientConsumer queryClient={queryClient}>{() => <></>}</QueryClientConsumer>
    ).not.toEqualTypeOf<ReactNode>()
  })
})
