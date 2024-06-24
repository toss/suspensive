export function loadModule<T>(name: string): T | undefined {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
    return require(name)
  } catch (e) {
    return undefined
  }
}
