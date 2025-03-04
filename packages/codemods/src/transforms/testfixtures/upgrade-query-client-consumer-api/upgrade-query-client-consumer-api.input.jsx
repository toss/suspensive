import { QueryClient } from '@tanstack/react-query'
import { QueryClientConsumer } from '@suspensive/react-query'

const queryClient = new QueryClient()
const queryClientContext = createContext<QueryClient>(queryClient)

const Test = () => {
  return (
    <QueryClientConsumer context={queryClientContext}>
      {(queryClient) => (
        <button
          onClick={() =>
            queryClient.invalidateQueries({
              queryKey: ['posts'],
            })
          }
        >
          Posts refresh
        </button>
      )}
    </QueryClientConsumer>
  )
}
