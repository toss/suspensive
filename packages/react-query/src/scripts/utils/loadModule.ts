export function loadModule<T>(name: string): T | undefined {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(name) as T
  } catch (e) {
    return undefined
  }
}
