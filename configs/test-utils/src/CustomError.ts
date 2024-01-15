export class CustomError extends Error {
  constructor(...args: ConstructorParameters<ErrorConstructor>) {
    super(...args)
    console.error(...args)
  }
}
