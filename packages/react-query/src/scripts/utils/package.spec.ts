import tanStackReactQueryPackageJson from '@tanstack/react-query/package.json'
import packageJson from '../../../package.json'
import {
  getIndexFileContent,
  getPackageJson,
  getTanStackReactQueryPackageJson,
  getTargetSuspensiveReactQueryAPIs,
  getTargetSuspensiveReactQueryVersion,
} from './package'

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

  it('should get the content of the index file', () => {
    const indexFileContent = getIndexFileContent()

    expect(indexFileContent).toBeDefined()
    expect(indexFileContent).toContain(`"use client"

// src/v4.ts
export * from "@suspensive/react-query-4";
//# sourceMappingURL=v4.js.map`)
  })

  it('should get the target @suspensive/react-query version from the index file content', () => {
    const targetSuspensiveReactQueryVersion = getTargetSuspensiveReactQueryVersion()

    expect(targetSuspensiveReactQueryVersion).toBe('4')
  })

  it('should get the target @suspensive/react-query version 4 APIs', () => {
    const apis = getTargetSuspensiveReactQueryAPIs()
    const version4APIs = [
      'useSuspenseQuery',
      'useSuspenseQueries',
      'useSuspenseInfiniteQuery',
      'queryOptions',
      'infiniteQueryOptions',
      '<SuspenseQuery/>',
      '<SuspenseQueries/>',
      '<SuspenseInfiniteQuery/>',
      '<Mutation/>',
    ]

    expect(apis).toEqual(version4APIs)
  })
})
