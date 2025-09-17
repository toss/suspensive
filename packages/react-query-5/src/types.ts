/**
 * Default error type that can be overridden globally
 * Users can override this by declaring a module augmentation like:
 *
 * declare module '@suspensive/react-query' {
 *   interface Register {
 *     defaultError: MyCustomError
 *   }
 * }
 */
export interface Register {
  defaultError: Error
}

/**
 * The default error type used throughout @suspensive/react-query
 * This will use the type from Register['defaultError'] if overridden,
 * otherwise defaults to Error
 */
export type DefaultError = Register['defaultError']
