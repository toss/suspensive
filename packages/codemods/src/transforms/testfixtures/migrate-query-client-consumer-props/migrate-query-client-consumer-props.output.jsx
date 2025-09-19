import { QueryClient } from '@tanstack/react-query'
import { QueryClientConsumer } from '@suspensive/react-query'

const queryClient = new QueryClient()
const queryClientContext = createContext(queryClient)

const PostRefreshButton = () => {
  return (
    <QueryClientConsumer queryClient={queryClient}>
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
  );
}
