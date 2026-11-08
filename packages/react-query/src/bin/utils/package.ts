import fs from 'node:fs'
import path from 'node:path'

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function loadModule<T>(name: string): T {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(name) as T
  } catch {
    throw new Error(`${name} is not found.`)
  }
}

type PackageJson = {
  name: string
  description: string
  version: string
}

export function getPackageJson(): PackageJson {
  return loadModule<PackageJson>('@suspensive/react-query/package.json')
}

export function getTanStackReactQueryPackageJson(): PackageJson {
  return loadModule<PackageJson>('@tanstack/react-query/package.json')
}

export function getSuspensiveReactQueryPackageJson(targetVersion: string): PackageJson {
  switch (targetVersion) {
    case '4':
    case '5':
      return loadModule<PackageJson>(`@suspensive/react-query-${targetVersion}/package.json`)
    default:
      throw new Error(`@suspensive/react-query-${targetVersion} is not found.`)
  }
}

export function getIndexFileContent(
  packageRoot = path.dirname(require.resolve('@suspensive/react-query/package.json'))
): string {
  const indexFilePath = path.join(packageRoot, 'dist', 'index.mjs')

  try {
    return fs.readFileSync(indexFilePath, 'utf-8')
  } catch {
    throw new Error(`no such file or directory, open '${indexFilePath}'`)
  }
}

export function getTargetSuspensiveReactQueryVersion(): string | undefined {
  const indexFileContent = getIndexFileContent()
  const version = new RegExp(/@suspensive\/react-query-(\d+)/).exec(indexFileContent)?.[1]

  return version
}

export function getTargetSuspensiveReactQueryAPIs(): string[] {
  const indexFileContent = getIndexFileContent()
  const modules = indexFileContent.matchAll(/from ['"](@suspensive\/react-query-\d+)['"]/g)
  const results: string[] = []

  for (const [, moduleName] of modules) {
    const module = loadModule<Record<string, unknown>>(moduleName)
    results.push(...Object.keys(module).reverse())
  }

  return results
}

export function getTanStackReactQueryAPIs(majorVersionOfTanStackQuery: string): string[] {
  switch (majorVersionOfTanStackQuery) {
    case '5':
      return [
        'useSuspenseQuery',
        'useSuspenseQueries',
        'useSuspenseInfiniteQuery',
        'usePrefetchQuery',
        'usePrefetchInfiniteQuery',
        'queryOptions',
        'infiniteQueryOptions',
      ]
    case '4':
      return ['-']
    default: {
      throw new Error('@tanstack/react-query version is required')
    }
  }
}
