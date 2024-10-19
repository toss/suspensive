import { QueryClient } from '@tanstack/react-query'
import { type ReactNode, createContext } from 'react'
import { QueryClientConsumer } from './QueryClientConsumer'

const reactQueryContext = createContext<QueryClient | undefined>(new QueryClient())

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
      <QueryClientConsumer context={reactQueryContext}>
        {(queryClient) => {
          expectTypeOf(queryClient).toEqualTypeOf<QueryClient>()
          return <></>
        }}
      </QueryClientConsumer>
    ))()
    expectTypeOf(<QueryClientConsumer>{() => <></>}</QueryClientConsumer>).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(<QueryClientConsumer>{() => <></>}</QueryClientConsumer>).not.toEqualTypeOf<ReactNode>()
    expectTypeOf(
      <QueryClientConsumer context={reactQueryContext}>{() => <></>}</QueryClientConsumer>
    ).toEqualTypeOf<React.JSX.Element>()
    expectTypeOf(
      <QueryClientConsumer context={reactQueryContext}>{() => <></>}</QueryClientConsumer>
    ).not.toEqualTypeOf<ReactNode>()
  })
})
