import type { ExtractErrorType } from './ExtractErrorType'

class CustomError extends Error {
  customProperty = 'custom'
}

class AnotherError extends Error {
  anotherProperty = 'another'
}

describe('ExtractErrorType', () => {
  it('should extract specific error type from single Error constructor', () => {
    type Result = ExtractErrorType<typeof CustomError>
    expectTypeOf<Result>().toEqualTypeOf<CustomError>()
  })

  it('should extract union error type from array of Error constructors', () => {
    type Result = ExtractErrorType<[typeof CustomError, typeof AnotherError]>
    expectTypeOf<Result>().toEqualTypeOf<CustomError | AnotherError>()
  })

  it('should fallback to generic Error type for boolean values', () => {
    type Result = ExtractErrorType<true>
    expectTypeOf<Result>().toEqualTypeOf<Error>()
  })

  it('should fallback to generic Error type for callback functions', () => {
    type Result = ExtractErrorType<(error: Error) => boolean>
    expectTypeOf<Result>().toEqualTypeOf<Error>()
  })

  it('should fallback to generic Error type for mixed arrays with non-constructor items', () => {
    type Result = ExtractErrorType<[typeof CustomError, true, (error: Error) => boolean]>
    expectTypeOf<Result>().toEqualTypeOf<Error>()
  })

  it('should extract union error type from array containing only Error constructors', () => {
    type Result = ExtractErrorType<[typeof CustomError, typeof AnotherError, typeof Error]>
    expectTypeOf<Result>().toEqualTypeOf<CustomError | AnotherError | Error>()
  })

  it('should fallback to generic Error type for undefined values', () => {
    type Result = ExtractErrorType<undefined>
    expectTypeOf<Result>().toEqualTypeOf<Error>()
  })
})
