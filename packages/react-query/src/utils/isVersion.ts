export const isVersion = (version: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7) => ({
  of: (packageVersion: string) => {
    const [major] = packageVersion.split('.').map(Number)
    return major === version
  },
})
