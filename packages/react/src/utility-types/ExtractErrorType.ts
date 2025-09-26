import type { ConstructorType } from './ConstructorType'

type ShouldCatchItemErrorValidationCallback = (error: Error) => boolean
type ShouldCatchItemErrorAssertionCallback<T extends Error> =
  | ((error: unknown) => error is T)
  | ((error: Error) => error is T)

type ShouldCatchItem =
  | ConstructorType<Error>
  | ShouldCatchItemErrorValidationCallback
  | ShouldCatchItemErrorAssertionCallback<Error>
  | boolean

/**
 * Extract the error type from a single shouldCatch item
 * Returns the specific error type if it's an Error constructor or type guard function, otherwise returns never
 */
type ExtractErrorFromShouldCatch<T> =
  T extends ConstructorType<infer U>
    ? U extends Error
      ? U
      : never
    : T extends ShouldCatchItemErrorAssertionCallback<infer U>
      ? U extends Error
        ? U
        : never
      : never

/**
 * Extract error types from an array of shouldCatch items
 * Returns union of all specific error types from constructors and type guards, or never if none
 */
type ExtractErrorFromShouldCatchArray<T extends readonly ShouldCatchItem[]> = T extends readonly [
  infer First,
  ...infer Rest,
]
  ? Rest extends readonly ShouldCatchItem[]
    ? ExtractErrorFromShouldCatch<First> | ExtractErrorFromShouldCatchArray<Rest>
    : ExtractErrorFromShouldCatch<First>
  : never

/**
 * Check if an array contains only Error constructors and type guard functions
 * Returns true if all items are type-safe error handlers, false otherwise
 */
type ArrayHasOnlyConstructors<T extends readonly ShouldCatchItem[]> = T extends readonly []
  ? true
  : T extends readonly [infer First, ...infer Rest]
    ? Rest extends readonly ShouldCatchItem[]
      ? First extends ConstructorType<Error> | ShouldCatchItemErrorAssertionCallback<Error>
        ? ArrayHasOnlyConstructors<Rest>
        : false
      : First extends ConstructorType<Error> | ShouldCatchItemErrorAssertionCallback<Error>
        ? true
        : false
    : false

/**
 * Main type to extract error types from shouldCatch prop
 * Automatically infers specific error types from Error constructors and type guards
 * Falls back to generic Error type for boolean or callback functions
 */
export type ExtractErrorType<T> =
  T extends ConstructorType<infer U>
    ? U extends Error
      ? U
      : Error
    : T extends readonly ShouldCatchItem[]
      ? ArrayHasOnlyConstructors<T> extends true
        ? ExtractErrorFromShouldCatchArray<T> extends never
          ? Error
          : ExtractErrorFromShouldCatchArray<T>
        : Error
      : Error
