import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Mutation } from './Mutation'

function renderWithClient(client: QueryClient, ui: ReactNode) {
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>)
}

describe('<Mutation />', () => {
  let queryCache: QueryCache
  let mutationCache: MutationCache
  let queryClient: QueryClient

  beforeEach(() => {
    queryCache = new QueryCache()
    mutationCache = new MutationCache()
    queryClient = new QueryClient({
      queryCache,
      mutationCache,
    })
  })

  it('should update and reset `data` correctly', async () => {
    function Page() {
      return (
        <Mutation mutationFn={() => Promise.resolve('mutation')}>
          {({ mutate, data = 'empty', reset }) => (
            <div>
              <h1>{data}</h1>
              <button type="button" onClick={() => reset()}>
                reset
              </button>
              <button type="button" onClick={() => mutate()}>
                mutate
              </button>
            </div>
          )}
        </Mutation>
      )
    }

    renderWithClient(queryClient, <Page />)

    expect(screen.getByRole('heading')).toHaveTextContent('empty')
    fireEvent.click(screen.getByRole('button', { name: 'mutate' }))
    expect(await screen.findByRole('heading')).toHaveTextContent('mutation')
    fireEvent.click(screen.getByRole('button', { name: 'reset' }))
    expect(await screen.findByRole('heading')).toHaveTextContent('empty')
  })
})
