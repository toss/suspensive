import fs from 'node:fs'
import path from 'node:path'

type LoadModuleResult<T> = { exports: T; isSuccess: true }

export function loadModule<T>(name: string): LoadModuleResult<T> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return { exports: require(name) as T, isSuccess: true }
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
  const module = loadModule<PackageJson>('@suspensive/react-query/package.json')

  return module.exports
}

export function getTanStackReactQueryPackageJson(): PackageJson {
  const module = loadModule<PackageJson>('@tanstack/react-query/package.json')

  return module.exports
}

export function getSuspensiveReactQueryPackageJson(targetVersion: string): PackageJson {
  let module: LoadModuleResult<PackageJson>

  switch (targetVersion) {
    case '5':
      module = loadModule<PackageJson>('@suspensive/react-query-5/package.json')
      break
    case '4':
      module = loadModule<PackageJson>('@suspensive/react-query-4/package.json')
      break
    default:
      throw new Error(`@suspensive/react-query-${targetVersion} is not found.`)
  }

  return module.exports
}

export function getIndexFileContent(...paths: string[]): string {
  const basePath = path.resolve(...paths, 'dist').replace(/src/, '')

  try {
    return fs.readFileSync(path.join(basePath, 'index.js'), 'utf-8')
  } catch {
    throw new Error(`no such file or directory, open '${paths}'`)
  }
}

export function getTargetSuspensiveReactQueryVersion(): string | undefined {
  const indexFileContent = getIndexFileContent(__dirname, '../../')
  const version = RegExp(/@suspensive\/react-query-(\d+)/).exec(indexFileContent)?.[1]

  return version
}

export function getTargetSuspensiveReactQueryAPIs(): string[] {
  const indexFileContent = getIndexFileContent(__dirname, '../../')
  const modules = indexFileContent.matchAll(/export \* from ['"](@suspensive\/react-query-\d+)['"]/g)
  const results: string[] = []

  for (const [, moduleName] of modules) {
    const module = loadModule<Record<string, unknown>>(moduleName)

    results.push(...Object.keys(module.exports).reverse())
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
