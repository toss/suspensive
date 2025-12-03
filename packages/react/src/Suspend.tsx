/**
 * A thenable that never resolves.
 * When thrown inside a React component wrapped with Suspense,
 * it causes the Suspense boundary to stay in suspended state indefinitely.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
const infiniteThenable = { then() {} }

/**
 * This component suspends indefinitely when rendered.
 * It throws an infinite thenable that never resolves,
 * keeping the Suspense boundary in its fallback state forever.
 * @see {@link https://suspensive.org/docs/react/Suspend Suspensive Docs}
 */
export const Suspend = Object.assign(
  (): null => {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw infiniteThenable
  },
  {
    displayName: 'Suspend',
  }
)
