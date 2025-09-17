// Example: How to use DefaultError type overriding in @suspensive/react-query

// Step 1: Define your custom error type
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: unknown,
    public retryable: boolean = false
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Step 2: Create a types declaration file (e.g., types/react-query.d.ts)
declare module '@suspensive/react-query' {
  interface Register {
    defaultError: ApiError
  }
}

// Step 3: Use in your components - DefaultError is now ApiError automatically
import { SuspenseQuery } from '@suspensive/react-query'

export function UserProfile({ userId }: { userId: string }) {
  return (
    <SuspenseQuery queryKey={['user', userId]} queryFn={() => fetchUser(userId)}>
      {(query) => {
        // query.error is now typed as ApiError | null
        if (query.error) {
          // TypeScript knows about your custom properties
          if (query.error.status === 404) {
            return <div>User not found</div>
          }
          if (query.error.status >= 500 && query.error.retryable) {
            return <div>Server error - will retry</div>
          }
          console.log('Error response:', query.error.response)
        }

        return <div>Hello, {query.data.name}!</div>
      }}
    </SuspenseQuery>
  )
}

// You can still override the error type per component if needed
export function SpecialComponent() {
  return (
    <SuspenseQuery<UserData, Error> // Explicitly use Error instead of ApiError
      queryKey={['special']}
      queryFn={() => fetchSpecialData()}
    >
      {(query) => {
        // query.error is typed as Error | null here
        return <div>{query.data}</div>
      }}
    </SuspenseQuery>
  )
}

// Mock functions for the example
async function fetchUser(userId: string) {
  const response = await fetch(`/api/users/${userId}`)
  if (!response.ok) {
    throw new ApiError('Failed to fetch user', response.status, await response.json(), response.status >= 500)
  }
  return response.json()
}

async function fetchSpecialData() {
  // This might throw regular Error instead of ApiError
  return 'special data'
}

type UserData = {
  name: string
  email: string
}
