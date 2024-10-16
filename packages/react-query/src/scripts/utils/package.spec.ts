import tanStackReactQueryPackageJson from '@tanstack/react-query/package.json'
import packageJson from '../../../package.json'
import {
  type PackageJson,
  getSuspensiveReactQueryPackageJson,
  getTargetSuspensiveReactQueryAPIs,
  getTargetSuspensiveReactQueryVersion,
  loadModule,
} from './package'

const version4APIs = [
  'useSuspenseQuery',
  'useSuspenseQueries',
  'useSuspenseInfiniteQuery',
  'usePrefetchQuery',
  'usePrefetchInfiniteQuery',
  'queryOptions',
  'infiniteQueryOptions',
  'SuspenseQuery',
  'SuspenseQueries',
  'SuspenseInfiniteQuery',
  'QueryErrorBoundary',
  'QueryClientConsumer',
  'PrefetchQuery',
  'PrefetchInfiniteQuery',
  'Mutation',
]

describe('loadModule', () => {
  it('should get package.json', () => {
    const module = loadModule<PackageJson>('@suspensive/react-query/package.json')
    assert(module.isSuccess, '@suspensive/react-query `package.json` is not found.')
    expect(module.exports).toBeDefined()
    expect(module.exports.name).toBe(packageJson.name)
    expect(module.exports.description).toBe(packageJson.description)
    expect(module.exports.version).toBe(packageJson.version)
  })

  it('should return `{ exports: undefined, isSuccess: false }` if unresolved package', () => {
    expect(loadModule('unresolved-module-to-test')).toStrictEqual({ exports: undefined, isSuccess: false })
  })
})

describe('getTanStackReactQueryPackageJson', () => {
  it('should get @tanstack/react-query package.json', () => {
    const tanStackReactQueryPackageJsonModule = loadModule<PackageJson>('@tanstack/react-query/package.json')
    assert(
      tanStackReactQueryPackageJsonModule.isSuccess,
      '@tanstack/react-query is not found. Please install @tanstack/react-query.'
    )

    expect(tanStackReactQueryPackageJsonModule.exports).toBeDefined()
    expect(tanStackReactQueryPackageJsonModule.exports.name).toBe(tanStackReactQueryPackageJson.name)
    expect(tanStackReactQueryPackageJsonModule.exports.description).toBe(tanStackReactQueryPackageJson.description)
    expect(tanStackReactQueryPackageJsonModule.exports.version).toBe(tanStackReactQueryPackageJson.version)
  })
})

describe('getTargetSuspensiveReactQueryVersion', () => {
  it('should get the target @suspensive/react-query version from the index file content', () => {
    const targetSuspensiveReactQueryVersion = getTargetSuspensiveReactQueryVersion()

    expect(targetSuspensiveReactQueryVersion).toBe('4')
  })
})

describe('getTargetSuspensiveReactQueryAPIs', () => {
  it('should get the target @suspensive/react-query version 4 APIs', () => {
    const apis = getTargetSuspensiveReactQueryAPIs()

    expect(apis).toEqual(version4APIs)
  })
})

describe('getSuspensiveReactQueryPackageJson', () => {
  it('should get the @suspensive/react-query package.json for version 4', () => {
    const result = getSuspensiveReactQueryPackageJson('4')

    expect(result).toBeDefined()
    expect(result.name).toBe('@suspensive/react-query-4')
  })
})
