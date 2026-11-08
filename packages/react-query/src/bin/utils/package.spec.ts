import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import tanStackReactQueryPackageJson from '@tanstack/react-query/package.json'
import packageJson from '../../../package.json'
import {
  getIndexFileContent,
  getPackageJson,
  getSuspensiveReactQueryPackageJson,
  getTanStackReactQueryAPIs,
  getTanStackReactQueryPackageJson,
  getTargetSuspensiveReactQueryAPIs,
  getTargetSuspensiveReactQueryVersion,
  loadModule,
} from './package'

const cliPath = path.resolve(__dirname, '../../../dist/bin/cli.cjs')

describe('package', () => {
  describe('getPackageJson', () => {
    it('should get package.json', () => {
      const result = getPackageJson()

      expect(result).toBeDefined()
      expect(result.name).toBe(packageJson.name)
      expect(result.description).toBe(packageJson.description)
      expect(result.version).toBe(packageJson.version)
    })
  })

  describe('getTanStackReactQueryPackageJson', () => {
    it('should get @tanstack/react-query package.json', () => {
      const result = getTanStackReactQueryPackageJson()

      expect(result).toBeDefined()
      expect(result.name).toBe(tanStackReactQueryPackageJson.name)
      expect(result.description).toBe(tanStackReactQueryPackageJson.description)
      expect(result.version).toBe(tanStackReactQueryPackageJson.version)
    })
  })

  describe('getTargetSuspensiveReactQueryVersion', () => {
    it('should get the target @suspensive/react-query-4 from the index file content', () => {
      const switchResult = execFileSync('node', [cliPath, 'switch', '4']).toString()
      expect(switchResult).toContain('[@suspensive/react-query] switched to version v4')
      const targetSuspensiveReactQueryVersion = getTargetSuspensiveReactQueryVersion()

      expect(targetSuspensiveReactQueryVersion).toBe('4')
    })

    it('should get the target @suspensive/react-query-5 from the index file content', () => {
      const switchResult = execFileSync('node', [cliPath, 'switch', '5']).toString()
      expect(switchResult).toContain('[@suspensive/react-query] switched to version v5')
      const targetSuspensiveReactQueryVersion = getTargetSuspensiveReactQueryVersion()

      expect(targetSuspensiveReactQueryVersion).toBe('5')
    })
  })

  describe('getTargetSuspensiveReactQueryAPIs', () => {
    const version4APIs = [
      'useSuspenseQuery',
      'useSuspenseQueries',
      'useSuspenseInfiniteQuery',
      'usePrefetchQuery',
      'usePrefetchInfiniteQuery',
      'queryOptions',
      'mutationOptions',
      'infiniteQueryOptions',
      'createGetQueryClient',
      'SuspenseQuery',
      'SuspenseQueries',
      'SuspenseInfiniteQuery',
      'QueryClientConsumer',
      'QueriesHydration',
      'PrefetchQuery',
      'PrefetchInfiniteQuery',
      'Mutation',
      'IsFetching',
    ]

    const version5APIs = [
      'useSuspenseQuery',
      'useSuspenseQueries',
      'useSuspenseInfiniteQuery',
      'usePrefetchQuery',
      'usePrefetchInfiniteQuery',
      'queryOptions',
      'mutationOptions',
      'infiniteQueryOptions',
      'createGetQueryClient',
      'SuspenseQuery',
      'SuspenseQueries',
      'SuspenseInfiniteQuery',
      'QueryClientConsumer',
      'QueriesHydration',
      'PrefetchQuery',
      'PrefetchInfiniteQuery',
      'Mutation',
      'IsFetching',
    ]

    it('should get the target @suspensive/react-query version 5 APIs', () => {
      const switchResult = execFileSync('node', [cliPath, 'switch', '5']).toString()
      expect(switchResult).toContain('[@suspensive/react-query] switched to version v5')

      const apis = getTargetSuspensiveReactQueryAPIs()

      expect(apis).toEqual(version4APIs)
    })

    it('should get the target @suspensive/react-query version 4 APIs', () => {
      const switchResult = execFileSync('node', [cliPath, 'switch', '4']).toString()
      expect(switchResult).toContain('[@suspensive/react-query] switched to version v4')

      const apis = getTargetSuspensiveReactQueryAPIs()

      expect(apis).toEqual(version5APIs)
    })
  })

  describe('getSuspensiveReactQueryPackageJson', () => {
    it('should get the @suspensive/react-query package.json for version 4', () => {
      const result = getSuspensiveReactQueryPackageJson('4')

      expect(result).toBeDefined()
      expect(result.name).toBe('@suspensive/react-query-4')
    })

    it('should get the @suspensive/react-query package.json for version 5', () => {
      const result = getSuspensiveReactQueryPackageJson('5')

      expect(result).toBeDefined()
      expect(result.name).toBe('@suspensive/react-query-5')
    })

    it('should get the @suspensive/react-query package.json for version 0', () => {
      expect(() => getSuspensiveReactQueryPackageJson('0')).toThrow('@suspensive/react-query-0 is not found.')
    })
  })

  describe('getTanStackReactQueryAPIs', () => {
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
    it('should throw an error if the module cannot be resolved', () => {
      expect(() => loadModule('unresolved-module-to-test')).toThrow('unresolved-module-to-test is not found.')
    })
  })

  describe('getIndexFileContent', () => {
    it('should read dist/index.mjs of the package even when the package path contains "src"', () => {
      const packageRoot = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'suspensive-')), 'src', 'app')
      fs.mkdirSync(path.join(packageRoot, 'dist'), { recursive: true })
      fs.writeFileSync(path.join(packageRoot, 'dist', 'index.mjs'), 'export * from "@suspensive/react-query-5"')

      expect(getIndexFileContent(packageRoot)).toBe('export * from "@suspensive/react-query-5"')
    })

    it('should throw an error with the path of the missing index file', () => {
      const packageRoot = path.join(os.tmpdir(), 'unresolved-package-to-test')

      expect(() => getIndexFileContent(packageRoot)).toThrow(
        `no such file or directory, open '${path.join(packageRoot, 'dist', 'index.mjs')}'`
      )
    })
  })
})
