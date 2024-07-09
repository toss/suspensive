export function loadModule<T>(name: string): T | undefined {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return require(name)
  } catch (e) {
    return undefined
  }
}
