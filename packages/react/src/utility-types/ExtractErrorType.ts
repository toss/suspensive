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
 * Extract the error type from a single ShouldCatch value
 * Returns the error type if it's a constructor or assertion function, otherwise returns never
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
 * Extract error types from an array of ShouldCatch values
 * Returns union of all constructor error types, or never if none
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
 * Check if an array contains only error constructors, assertion functions, or instanceof functions
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
 * Only narrows when we have pure error constructors or assertion functions, otherwise falls back to Error
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
