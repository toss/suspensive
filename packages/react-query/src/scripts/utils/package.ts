import fs from 'fs'
import path from 'path'
import { exit } from 'process'

type LoadModuleResult<T> = { exports: T; isSuccess: true } | { exports: undefined; isSuccess: false }

export function loadModule<T>(name: string): LoadModuleResult<T> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return { exports: require(name) as T, isSuccess: true }
  } catch (e) {
    return { exports: undefined, isSuccess: false }
  }
}

type PackageJson = {
  name: string
  description: string
  version: string
}

export function getPackageJson(): PackageJson {
  const module = loadModule<PackageJson>('@suspensive/react-query/package.json')
  if (!module.isSuccess) {
    console.warn('@suspensive/react-query `package.json` is not found.')
    exit(1)
  }

  return module.exports
}

export function getTanStackReactQueryPackageJson(): PackageJson {
  const module = loadModule<PackageJson>('@tanstack/react-query/package.json')
  if (!module.isSuccess) {
    console.warn('@tanstack/react-query is not found. Please install @tanstack/react-query.')
    exit(1)
  }

  return module.exports
}

export function getSuspensiveReactQueryPackageJson(targetVersion: string): PackageJson {
  let module: LoadModuleResult<PackageJson>

  switch (targetVersion) {
    case '4':
      module = loadModule<PackageJson>('@suspensive/react-query-4/package.json')
      break
    case '5':
      module = loadModule<PackageJson>('@suspensive/react-query-5/package.json')
      break
    default:
      console.warn(`@suspensive/react-query-${targetVersion} is not found.`)
      exit(1)
  }

  if (!module.isSuccess) {
    console.warn(`@suspensive/react-query-${targetVersion} is not found.`)
    exit(1)
  }

  return module.exports
}

export function getIndexFileContent(...paths: string[]): string {
  const basePath = path.resolve(...paths, 'dist').replace(/src/, '')

  return fs.readFileSync(path.join(basePath, 'index.js'), 'utf-8') || ''
}

export function getTargetSuspensiveReactQueryVersion(): string {
  const indexFileContent = getIndexFileContent(__dirname, '../../')

  return (RegExp(/@suspensive\/react-query-(\d+)/).exec(indexFileContent) || [])[1] || ''
}

export function getTargetSuspensiveReactQueryAPIs(): string[] {
  const indexFileContent = getIndexFileContent(__dirname, '../../')

  const modules = indexFileContent.matchAll(/export \* from ['"](@suspensive\/react-query-\d+)['"]/g)
  const results: string[] = []

  for (const [, moduleName] of modules) {
    const module = loadModule<Record<string, unknown>>(moduleName)

    if (!module.isSuccess) {
      console.warn('[@suspensive/react-query]', `Module ${moduleName} is not found`)
      exit(1)
    }

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
