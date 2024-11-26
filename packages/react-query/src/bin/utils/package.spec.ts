import tanStackReactQueryPackageJson from '@tanstack/react-query/package.json'
import packageJson from '../../../package.json'
import {
  getPackageJson,
  getSuspensiveReactQueryPackageJson,
  getTanStackReactQueryAPIs,
  getTanStackReactQueryPackageJson,
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

describe('package', () => {
  it('should get package.json', () => {
    const result = getPackageJson()

    expect(result).toBeDefined()
    expect(result.name).toBe(packageJson.name)
    expect(result.description).toBe(packageJson.description)
    expect(result.version).toBe(packageJson.version)
  })

  it('should get @tanstack/react-query package.json', () => {
    const result = getTanStackReactQueryPackageJson()

    expect(result).toBeDefined()
    expect(result.name).toBe(tanStackReactQueryPackageJson.name)
    expect(result.description).toBe(tanStackReactQueryPackageJson.description)
    expect(result.version).toBe(tanStackReactQueryPackageJson.version)
  })

  it('should get the target @suspensive/react-query version from the index file content', () => {
    const targetSuspensiveReactQueryVersion = getTargetSuspensiveReactQueryVersion()

    expect(targetSuspensiveReactQueryVersion).toBe('4')
  })

  it('should get the target @suspensive/react-query version 4 APIs', () => {
    const apis = getTargetSuspensiveReactQueryAPIs()

    expect(apis).toEqual(version4APIs)
  })

  it('should get the @suspensive/react-query package.json for version 4', () => {
    const result = getSuspensiveReactQueryPackageJson('4')

    expect(result).toBeDefined()
    expect(result.name).toBe('@suspensive/react-query-4')
  })

  it('should return correct APIs for version 5', () => {
    const apis = getTanStackReactQueryAPIs('5')

    expect(apis).toEqual([
      'useSuspenseQuery',
      'useSuspenseQueries',
      'useSuspenseInfiniteQuery',
      'usePrefetchQuery',
      'usePrefetchInfiniteQuery',
      'queryOptions',
      'infiniteQueryOptions',
    ])
  })

  it('should return placeholder for version 4', () => {
    const apis = getTanStackReactQueryAPIs('4')

    expect(apis).toEqual(['-'])
  })

  it('should throw error for missing version', () => {
    expect(() => getTanStackReactQueryAPIs('')).toThrow('@tanstack/react-query version is required')
  })
})

describe('loadModule', () => {
  it('should return `{ exports: undefined, isSuccess: false }` if unresolved package', () => {
    expect(loadModule('unresolved-module-to-test')).toStrictEqual({ exports: undefined, isSuccess: false })
  })
})
