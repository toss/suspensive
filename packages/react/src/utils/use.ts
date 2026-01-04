type Usable<T> = PromiseLike<T> & {
  status?: 'pending' | 'fulfilled' | 'rejected'
  value?: T
  reason?: unknown
}

// eslint-disable-next-line @eslint-react/no-unnecessary-use-prefix
export function use<T>(usable: Usable<T>): T {
  if (usable.status === 'pending') {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw usable
  } else if (usable.status === 'fulfilled') {
    return usable.value as T
  } else if (usable.status === 'rejected') {
    throw usable.reason
  } else {
    usable.status = 'pending'
    usable.then(
      (value) => {
        usable.status = 'fulfilled'
        usable.value = value
      },
      (error: unknown) => {
        usable.status = 'rejected'
        usable.reason = error
      }
    )
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw usable
  }
}
