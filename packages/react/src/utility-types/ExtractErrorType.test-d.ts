import type { ExtractErrorType } from './ExtractErrorType'

class CustomError extends Error {
  customProperty = 'custom'
}

class AnotherError extends Error {
  anotherProperty = 'another'
}

describe('ExtractErrorType', () => {
  it('should extract error type from single constructor', () => {
    type Result = ExtractErrorType<typeof CustomError>
    expectTypeOf<Result>().toEqualTypeOf<CustomError>()
  })

  it('should extract union type from array of constructors', () => {
    type Result = ExtractErrorType<[typeof CustomError, typeof AnotherError]>
    expectTypeOf<Result>().toEqualTypeOf<CustomError | AnotherError>()
  })

  it('should fallback to Error for boolean', () => {
    type Result = ExtractErrorType<true>
    expectTypeOf<Result>().toEqualTypeOf<Error>()
  })

  it('should fallback to Error for function', () => {
    type Result = ExtractErrorType<(error: Error) => boolean>
    expectTypeOf<Result>().toEqualTypeOf<Error>()
  })

  it('should fallback to Error for mixed array', () => {
    type Result = ExtractErrorType<[typeof CustomError, true, (error: Error) => boolean]>
    expectTypeOf<Result>().toEqualTypeOf<Error>()
  })

  it('should extract types from array with only constructors', () => {
    type Result = ExtractErrorType<[typeof CustomError, typeof AnotherError, typeof Error]>
    expectTypeOf<Result>().toEqualTypeOf<CustomError | AnotherError | Error>()
  })

  it('should fallback to Error for undefined', () => {
    type Result = ExtractErrorType<undefined>
    expectTypeOf<Result>().toEqualTypeOf<Error>()
  })
})
