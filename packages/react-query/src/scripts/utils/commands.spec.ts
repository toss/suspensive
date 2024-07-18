import fs from 'fs'
import path from 'path'
import type { Mock, MockInstance } from 'vitest'
import packageJson from '../../../package.json'
import { fixAction, getSuspensiveReactQueryVersion, statusAction, switchAction } from './commands'
import * as packageUtils from './package'
import { switchVersion } from './switchVersion'
import { getStatusTable } from './table'

vi.mock('fs')
vi.mock('path')
vi.mock('./package')
vi.mock('./switchVersion')

describe('commands', () => {
  let consoleLogSpy: MockInstance
  let consoleWarnSpy: MockInstance

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    vi.mocked(path.join).mockReturnValue('./dist/index.js')
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation((): void => {})
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const getPackageJsonMock = packageUtils.getPackageJson as Mock
    getPackageJsonMock.mockReturnValue(packageJson)

    const getTanStackReactQueryPackageJsonMock = packageUtils.getTanStackReactQueryPackageJson as Mock
    getTanStackReactQueryPackageJsonMock.mockReturnValue({ version: '4.0.0' })

    const getTargetSuspensiveReactQueryPackageJsonMock = packageUtils.getSuspensiveReactQueryPackageJson as Mock
    getTargetSuspensiveReactQueryPackageJsonMock.mockReturnValue({ version: '' })

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

      statusAction()

      expect(consoleLogSpy).toHaveBeenCalledWith(getStatusTable('4'))
    })

    it('should display the status correctly when versions are compatible (version 5)', () => {
      vi.mocked(fs.readFileSync).mockReturnValue(`export * from '@suspensive/react-query-5'`)

      statusAction()

      expect(consoleLogSpy).toHaveBeenCalledWith(getStatusTable('5'))
    })

    it('should display incompatible versions message (suspensive 5, tanstack 4)', () => {
      vi.mocked(fs.readFileSync).mockReturnValue(`export * from '@suspensive/react-query-5'`)
      const getTanStackReactQueryPackageJsonMock = packageUtils.getTanStackReactQueryPackageJson as Mock
      getTanStackReactQueryPackageJsonMock.mockReturnValue({ version: '4.0.0' })

      statusAction()

      expect(consoleLogSpy).toHaveBeenCalledWith(getStatusTable('5'))
    })

    it('should display incompatible versions message (suspensive 4, tanstack 5)', () => {
      vi.mocked(fs.readFileSync).mockReturnValue(`export * from '@suspensive/react-query-4'`)
      const getTanStackReactQueryPackageJsonMock = packageUtils.getTanStackReactQueryPackageJson as Mock
      getTanStackReactQueryPackageJsonMock.mockReturnValue({ version: '5.0.0' })

      statusAction()

      expect(consoleLogSpy).toHaveBeenCalledWith(getStatusTable('4'))
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
