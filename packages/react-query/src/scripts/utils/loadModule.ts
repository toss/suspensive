export type LoadModuleResult<T> = { exports: T; isSuccess: true } | { exports: undefined; isSuccess: false }

export function loadModule<T>(name: string): LoadModuleResult<T> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return { exports: require(name) as T, isSuccess: true }
  } catch (e) {
    return { exports: undefined, isSuccess: false }
  }
}
