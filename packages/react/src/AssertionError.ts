/** @experimental This is experimental feature. */
export class AssertionError extends Error {
  static assert(condition: boolean, message: string): asserts condition {
    if (!condition) {
      throw new AssertionError(message)
    }
  }
}
