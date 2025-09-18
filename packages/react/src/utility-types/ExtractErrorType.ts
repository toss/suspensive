import type { ConstructorType } from './ConstructorType'

type ShouldCatchCallback = (error: Error) => boolean
type ShouldCatch = ConstructorType<Error> | ShouldCatchCallback | boolean

/**
 * Extract the error type from a single ShouldCatch value
 * Only returns the error type if it's a constructor, otherwise returns never
 */
type ExtractErrorFromShouldCatch<T> = T extends ConstructorType<infer U> ? (U extends Error ? U : never) : never

/**
 * Extract error types from an array of ShouldCatch values
 * Returns union of all constructor error types, or never if none
 */
type ExtractErrorFromShouldCatchArray<T extends readonly ShouldCatch[]> = T extends readonly [
  infer First,
  ...infer Rest,
]
  ? Rest extends readonly ShouldCatch[]
    ? ExtractErrorFromShouldCatch<First> | ExtractErrorFromShouldCatchArray<Rest>
    : ExtractErrorFromShouldCatch<First>
  : never

/**
 * Check if an array contains only error constructors
 */
type ArrayHasOnlyConstructors<T extends readonly ShouldCatch[]> = T extends readonly []
  ? true
  : T extends readonly [infer First, ...infer Rest]
    ? Rest extends readonly ShouldCatch[]
      ? First extends ConstructorType<Error>
        ? ArrayHasOnlyConstructors<Rest>
        : false
      : First extends ConstructorType<Error>
        ? true
        : false
    : false

/**
 * Main type to extract error types from shouldCatch prop
 * Only narrows when we have pure error constructors, otherwise falls back to Error
 */
export type ExtractErrorType<T> =
  T extends ConstructorType<infer U>
    ? U extends Error
      ? U
      : Error
    : T extends readonly ShouldCatch[]
      ? ArrayHasOnlyConstructors<T> extends true
        ? ExtractErrorFromShouldCatchArray<T> extends never
          ? Error
          : ExtractErrorFromShouldCatchArray<T>
        : Error
      : Error
