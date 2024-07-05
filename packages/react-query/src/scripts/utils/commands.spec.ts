import fs from 'fs'
import path from 'path'
import type { Mock, MockInstance } from 'vitest'
import packageJson from '../../../package.json'
import {
  fixAction,
  getSuspensiveReactQueryVersion,
  statusAction,
  switchAction,
  version4APIs,
  version5APIs,
} from './commands'
import * as packageUtils from './package'
import { switchVersion } from './switchVersion'

vi.mock('fs')
vi.mock('path')
vi.mock('./package')
vi.mock('./switchVersion')

describe('commands', () => {
  let consoleLogSpy: MockInstance
  let consoleWarnSpy: MockInstance
  const tanStackReactQueryPackageJson = { name: '', description: '', version: '4.0.0' }

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    vi.mocked(path.join).mockReturnValue('./dist/index.js')
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation((): void => {})
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const getPackageJsonMock = packageUtils.getPackageJson as Mock
    getPackageJsonMock.mockReturnValue(packageJson)

    const getTanStackReactQueryPackageJsonMock = packageUtils.getTanStackReactQueryPackageJson as Mock
    getTanStackReactQueryPackageJsonMock.mockReturnValue(tanStackReactQueryPackageJson)

    vi.mocked(switchVersion).mockImplementation(() => {})
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('getSuspensiveReactQueryVersion', () => {
    it('should return the correct version', () => {
      vi.mocked(fs.readFileSync).mockReturnValue(`export * from '@suspensive/react-query-4'`)
      const result = getSuspensiveReactQueryVersion()
      expect(result).toBe('4')
    })

    it('should return "not found" when version is not present', () => {
      vi.mocked(fs.readFileSync).mockReturnValue(`export * from '@suspensive/react-query'`)
      const result = getSuspensiveReactQueryVersion()
      expect(result).toBe('not found')
    })
  })

  describe('statusAction', () => {
    it('should display the status correctly when versions are compatible (version 4)', () => {
      vi.mocked(fs.readFileSync).mockReturnValue(`export * from '@suspensive/react-query-4'`)
      const getTanStackReactQueryPackageJsonMock = packageUtils.getTanStackReactQueryPackageJson as Mock
      getTanStackReactQueryPackageJsonMock.mockReturnValue({ version: '4.0.0' })

      statusAction()

      expect(consoleLogSpy).toHaveBeenCalledWith('\nSuspensive React Query status:')
      expect(consoleLogSpy).toHaveBeenCalledWith(
        `@suspensive/react-query@${packageJson.version} export @suspensive/react-query-4's interfaces`
      )
      version4APIs.forEach((api) => {
        expect(consoleLogSpy).toHaveBeenCalledWith(`  - ${api}`)
      })
      expect(consoleLogSpy).toHaveBeenCalledWith(`@tanstack/react-query@${tanStackReactQueryPackageJson.version}`)
      expect(consoleLogSpy).toHaveBeenCalledWith('\nThe versions are compatible.')
    })

    it('should display the status correctly when versions are compatible (version 5)', () => {
      vi.mocked(fs.readFileSync).mockReturnValue(`export * from '@suspensive/react-query-5'`)
      const getTanStackReactQueryPackageJsonMock = packageUtils.getTanStackReactQueryPackageJson as Mock
      getTanStackReactQueryPackageJsonMock.mockReturnValue({ version: '5.0.0' })

      statusAction()

      expect(consoleLogSpy).toHaveBeenCalledWith('\nSuspensive React Query status:')
      expect(consoleLogSpy).toHaveBeenCalledWith(
        `@suspensive/react-query@${packageJson.version} export @suspensive/react-query-5's interfaces`
      )
      version5APIs.forEach((api) => {
        expect(consoleLogSpy).toHaveBeenCalledWith(`  - ${api}`)
      })
    })

    it('should display incompatible versions message (suspensive 5, tanstack 4)', () => {
      vi.mocked(fs.readFileSync).mockReturnValue(`export * from '@suspensive/react-query-5'`)

      statusAction()

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '\nThe version of @suspensive/react-query is not compatible with the current version of @tanstack/react-query.',
        `\nPlease run 'npx suspensive-react-query switch 4' to switch to the compatible version.`
      )
    })

    it('should display incompatible versions message (suspensive 4, tanstack 5)', () => {
      vi.mocked(fs.readFileSync).mockReturnValue(`export * from '@suspensive/react-query-4'`)
      const getTanStackReactQueryPackageJsonMock = packageUtils.getTanStackReactQueryPackageJson as Mock
      getTanStackReactQueryPackageJsonMock.mockReturnValue({ version: '5.0.0' })

      statusAction()

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '\nThe version of @suspensive/react-query is not compatible with the current version of @tanstack/react-query.',
        `\nPlease run 'npx suspensive-react-query switch 5' to switch to the compatible version.`
      )
    })
  })

  describe('switchAction', () => {
    it('should switch to version 4', () => {
      switchAction('4')

      expect(switchVersion).toHaveBeenCalledWith(4)
    })

    it('should switch to version 5', () => {
      switchAction('5')

      expect(switchVersion).toHaveBeenCalledWith(5)
    })

    it('should warn about not supported version', () => {
      switchAction('1')

      expect(consoleWarnSpy).toHaveBeenCalledWith('[@suspensive/react-query]', `version v1 is not supported.`)
    })
  })

  describe('fixAction', () => {
    it('should not switch when versions are compatible', () => {
      vi.mocked(fs.readFileSync).mockReturnValue(`export * from '@suspensive/react-query-4'`)

      fixAction()

      expect(consoleLogSpy).toHaveBeenCalledWith('[@suspensive/react-query]', `The versions are compatible.`)
      expect(switchVersion).not.toHaveBeenCalled()
    })

    it('should switch to version 5 when tanstack is 5', () => {
      vi.mocked(fs.readFileSync).mockReturnValue(`export * from '@suspensive/react-query-4'`)
      const getTanStackReactQueryPackageJsonMock = packageUtils.getTanStackReactQueryPackageJson as Mock
      getTanStackReactQueryPackageJsonMock.mockReturnValue({ version: '5.0.0' })

      fixAction()

      expect(consoleLogSpy).toHaveBeenCalledWith('[@suspensive/react-query]', `Switching to the compatible version...`)
      expect(switchVersion).toHaveBeenCalledWith(5)
    })
  })
})
