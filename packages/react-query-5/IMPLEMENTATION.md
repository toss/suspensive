# DefaultError Type Overriding Implementation Summary

## ✅ What was implemented

This implementation adds global error type overriding to `@suspensive/react-query`, similar to TanStack Query's DefaultError registration feature.

### Files Created/Modified:

1. **`src/types.ts`** - New file containing:
   - `Register` interface for module augmentation
   - `DefaultError` type that references `Register['defaultError']`

2. **Components Updated** - All components now use local `DefaultError`:
   - `SuspenseQuery.tsx`
   - `SuspenseInfiniteQuery.tsx`
   - `Mutation.tsx`
   - `PrefetchQuery.tsx`
   - `PrefetchInfiniteQuery.tsx`

3. **`src/index.ts`** - Updated to export new types

4. **`src/DefaultError.test-d.tsx`** - Comprehensive type tests

5. **Documentation and Examples** - Usage guides and practical examples

## 🚀 How it works

### Default Behavior (backward compatible)
```typescript
// Without module augmentation, DefaultError = Error (maintains existing behavior)
<SuspenseQuery queryKey={['users']} queryFn={fetchUsers}>
  {(query) => {
    // query.error is typed as Error | null
    return <div>{query.data}</div>
  }}
</SuspenseQuery>
```

### With Custom Error Type
```typescript
// 1. Define custom error
class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message)
  }
}

// 2. Register globally via module augmentation
declare module '@suspensive/react-query' {
  interface Register {
    defaultError: ApiError
  }
}

// 3. All components now use ApiError as default
<SuspenseQuery queryKey={['users']} queryFn={fetchUsers}>
  {(query) => {
    // query.error is now typed as ApiError | null
    if (query.error) {
      console.log(query.error.status) // TypeScript knows about .status property
    }
    return <div>{query.data}</div>
  }}
</SuspenseQuery>
```

## 🎯 Benefits

1. **Type Safety**: Users get proper TypeScript intellisense for their custom error properties
2. **Global Configuration**: Set once, applies to all Suspensive components
3. **Backward Compatible**: Existing code continues to work unchanged
4. **Per-Component Override**: Can still specify error type per component when needed
5. **Consistent with TanStack Query**: Same pattern as the underlying library

## 🧪 Testing

- Comprehensive type tests verify the feature works correctly
- Tests cover both default behavior and custom error types
- Existing tests confirm backward compatibility

## 📦 API

```typescript
// Export types for user consumption
export type { DefaultError, Register } from '@suspensive/react-query'

// Usage in module augmentation
declare module '@suspensive/react-query' {
  interface Register {
    defaultError: YourCustomErrorType
  }
}
```

This implementation successfully addresses the feature request from issue #1503 by providing the same DefaultError type overriding functionality that TanStack Query offers.