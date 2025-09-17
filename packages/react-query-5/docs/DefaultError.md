# DefaultError Type Overriding

The `@suspensive/react-query` library supports global error type overriding, similar to TanStack Query's DefaultError registration feature.

## Usage

You can override the default error type globally by declaring a module augmentation:

```typescript
// types/react-query.d.ts
declare module '@suspensive/react-query' {
  interface Register {
    defaultError: MyCustomError
  }
}
```

Once you've declared this, all Suspensive components and hooks will use your custom error type as the default:

```typescript
class MyCustomError extends Error {
  constructor(
    message: string,
    public code: number,
    public details?: unknown
  ) {
    super(message)
  }
}

// Now all components use MyCustomError as the default error type
<SuspenseQuery queryKey={['user']} queryFn={fetchUser}>
  {(query) => {
    // query.error is typed as MyCustomError | null
    if (query.error) {
      console.log(query.error.code) // TypeScript knows about the 'code' property
      console.log(query.error.details) // TypeScript knows about the 'details' property
    }
    return <div>{query.data.name}</div>
  }}
</SuspenseQuery>
```

## Affected Components and Hooks

This feature affects all components and hooks in the library:

- `SuspenseQuery`
- `SuspenseInfiniteQuery`  
- `SuspenseQueries`
- `Mutation`
- `PrefetchQuery`
- `PrefetchInfiniteQuery`
- All related hooks

## TypeScript Configuration

Make sure your TypeScript configuration includes the declaration file:

```json
{
  "compilerOptions": {
    "typeRoots": ["./types", "./node_modules/@types"]
  },
  "include": ["types/**/*"]
}
```

## Example with Custom Error Class

```typescript
// types/react-query.d.ts
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

declare module '@suspensive/react-query' {
  interface Register {
    defaultError: ApiError
  }
}
```

```typescript
// components/UserProfile.tsx
import { SuspenseQuery } from '@suspensive/react-query'

export function UserProfile({ userId }: { userId: string }) {
  return (
    <SuspenseQuery
      queryKey={['user', userId]}
      queryFn={() => fetchUser(userId)}
    >
      {(query) => {
        if (query.error) {
          // TypeScript knows this is ApiError
          if (query.error.status === 404) {
            return <div>User not found</div>
          }
          if (query.error.status >= 500) {
            return <div>Server error: {query.error.message}</div>
          }
        }
        
        return <div>Hello, {query.data.name}!</div>
      }}
    </SuspenseQuery>
  )
}
```