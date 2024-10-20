import fs from 'fs'
import type { Mock, MockInstance } from 'vitest'
import packageJson from '../../../package.json'
import { fixAction, statusAction, switchAction } from './commands'
import {
  getIndexFileContent,
  getSuspensiveReactQueryPackageJson,
  getTanStackReactQueryAPIs,
  getTargetSuspensiveReactQueryAPIs,
  getTargetSuspensiveReactQueryVersion,
  loadModule,
} from './package'
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
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const getIndexFileContentMock = getIndexFileContent as Mock
    getIndexFileContentMock.mockReturnValue('export * from "@suspensive/react-query-4"')
    const getSuspensiveReactQueryPackageJsonMock = getSuspensiveReactQueryPackageJson as Mock
    getSuspensiveReactQueryPackageJsonMock.mockReturnValue({ version: packageJson.version })
    const getTargetSuspensiveReactQueryVersionMock = getTargetSuspensiveReactQueryVersion as Mock
    getTargetSuspensiveReactQueryVersionMock.mockReturnValue('5')
    const getTargetSuspensiveReactQueryAPIsMock = getTargetSuspensiveReactQueryAPIs as Mock
    getTargetSuspensiveReactQueryAPIsMock.mockReturnValue([])
    const getTanStackReactQueryAPIsMock = getTanStackReactQueryAPIs as Mock
    getTanStackReactQueryAPIsMock.mockReturnValue([])

    vi.mocked(switchVersion).mockImplementation(() => {})
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('getSuspensiveReactQueryVersion', () => {
    it('should return the correct version', () => {
      const loadModuleMock = loadModule as Mock
      loadModuleMock.mockReturnValue({ isSuccess: true, exports: packageJson })
      const getTargetSuspensiveReactQueryVersionMock = getTargetSuspensiveReactQueryVersion as Mock
      getTargetSuspensiveReactQueryVersionMock.mockReturnValue('4')

      const result = getTargetSuspensiveReactQueryVersion()

      expect(result).toBe('4')
    })

    it('should return "not found" when version is not present', () => {
      const getTargetSuspensiveReactQueryVersionMock = getTargetSuspensiveReactQueryVersion as Mock
      getTargetSuspensiveReactQueryVersionMock.mockReturnValue('not found')

      const result = getTargetSuspensiveReactQueryVersion()

      expect(result).toBe('not found')
    })
  })

  describe('statusAction', () => {
    it('should display the status correctly when versions are compatible (version 4)', () => {
      const loadModuleMock = loadModule as Mock
      loadModuleMock.mockReturnValue({ isSuccess: true, exports: packageJson })
      const getTargetSuspensiveReactQueryVersionMock = getTargetSuspensiveReactQueryVersion as Mock
      getTargetSuspensiveReactQueryVersionMock.mockReturnValue('4')

      statusAction()

      expect(consoleLogSpy).toHaveBeenCalledWith(getStatusTable('4'))
    })

    it('should display the status correctly when versions are compatible (version 5)', () => {
      const loadModuleMock = loadModule as Mock
      loadModuleMock.mockReturnValue({ isSuccess: true, exports: packageJson })
      statusAction()

      expect(consoleLogSpy).toHaveBeenCalledWith(getStatusTable('5'))
    })

    it('should display incompatible versions message (suspensive 5, tanstack 4)', () => {
      const loadModuleMock = loadModule as Mock
      loadModuleMock.mockReturnValue({ isSuccess: true, exports: packageJson })
      statusAction()

      expect(consoleLogSpy).toHaveBeenCalledWith(getStatusTable('5'))
    })

    it('should display incompatible versions message (suspensive 4, tanstack 5)', () => {
      const loadModuleMock = loadModule as Mock
      loadModuleMock.mockReturnValue({ isSuccess: true, exports: packageJson })
      const getTargetSuspensiveReactQueryVersionMock = getTargetSuspensiveReactQueryVersion as Mock
      getTargetSuspensiveReactQueryVersionMock.mockReturnValue('4')

      statusAction()

      expect(consoleLogSpy).toHaveBeenCalledWith(getStatusTable('4'))
    })
  })

  describe('switchAction', () => {
    it('should switch to version 4', () => {
      const loadModuleMock = loadModule as Mock
      loadModuleMock.mockReturnValue({ isSuccess: true, exports: packageJson })
      switchAction('4')

      expect(switchVersion).toHaveBeenCalledWith(4)
    })

    it('should switch to version 5', () => {
      const loadModuleMock = loadModule as Mock
      loadModuleMock.mockReturnValue({ isSuccess: true, exports: packageJson })
      switchAction('5')

      expect(switchVersion).toHaveBeenCalledWith(5)
    })

    it('should warn about not supported version', () => {
      const loadModuleMock = loadModule as Mock
      loadModuleMock.mockReturnValue({ isSuccess: true, exports: packageJson })
      switchAction('1')

      expect(consoleWarnSpy).toHaveBeenCalledWith('[@suspensive/react-query]', `version v1 is not supported.`)
    })
  })

  describe('fixAction', () => {
    it('should not switch when versions are compatible', () => {
      const loadModuleMock = loadModule as Mock
      loadModuleMock.mockReturnValue({ isSuccess: true, exports: { version: '5' } })
      fixAction()

      expect(consoleLogSpy).toHaveBeenCalledWith('[@suspensive/react-query]', `The versions are compatible.`)
      expect(switchVersion).not.toHaveBeenCalled()
    })

    it('should switch to version 5 when tanstack is 5', () => {
      const loadModuleMock = loadModule as Mock
      loadModuleMock.mockReturnValue({ isSuccess: true, exports: { version: '5' } })
      vi.mocked(fs.readFileSync).mockReturnValue(`export * from '@suspensive/react-query-4'`)
      const getTargetSuspensiveReactQueryVersionMock = getTargetSuspensiveReactQueryVersion as Mock
      getTargetSuspensiveReactQueryVersionMock.mockReturnValue('4')

      fixAction()

      expect(consoleLogSpy).toHaveBeenCalledWith('[@suspensive/react-query]', `Switching to the compatible version...`)
      expect(switchVersion).toHaveBeenCalledWith(5)
    })
  })
})
