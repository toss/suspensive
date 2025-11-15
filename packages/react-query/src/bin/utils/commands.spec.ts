import fs from 'node:fs'
import packageJson from '../../../package.json'
import { fixAction, statusAction, switchAction } from './commands'
import {
  getIndexFileContent,
  getPackageJson,
  getSuspensiveReactQueryPackageJson,
  getTanStackReactQueryAPIs,
  getTanStackReactQueryPackageJson,
  getTargetSuspensiveReactQueryAPIs,
  getTargetSuspensiveReactQueryVersion,
} from './package'
import { switchVersion } from './switchVersion'
import { getStatusTable } from './table'

vi.mock('node:fs', () => ({
  default: {
    readFileSync: vi.fn(),
  },
}))
vi.mock('node:path')
vi.mock('./package')
vi.mock('./switchVersion')

describe('commands', () => {
  const consoleLogSpy = vi.spyOn(console, 'log').mockClear()
  const consoleWarnSpy = vi.spyOn(console, 'warn').mockClear()
  const consoleErrorSpy = vi.spyOn(console, 'error').mockClear()

  const mockGetPackageJson = vi.mocked(getPackageJson)
  mockGetPackageJson.mockReturnValue(packageJson)
  const mockGetIndexFileContent = vi.mocked(getIndexFileContent)
  mockGetIndexFileContent.mockReturnValue('export * from "@suspensive/react-query-4"')
  const mockGetTanStackReactQueryPackageJson = vi.mocked(getTanStackReactQueryPackageJson)
  mockGetTanStackReactQueryPackageJson.mockReturnValue({
    name: 'tanstack-query',
    description: '',
    version: '5.0.0',
  })
  const mockGetSuspensiveReactQueryPackageJson = vi.mocked(getSuspensiveReactQueryPackageJson)
  mockGetSuspensiveReactQueryPackageJson.mockReturnValue({
    name: 'tanstack-query',
    description: '',
    version: packageJson.version,
  })
  const mockGetTargetSuspensiveReactQueryAPIsMock = vi.mocked(getTargetSuspensiveReactQueryAPIs)
  mockGetTargetSuspensiveReactQueryAPIsMock.mockReturnValue([])
  const mockGetTanStackReactQueryAPIsMock = vi.mocked(getTanStackReactQueryAPIs)
  mockGetTanStackReactQueryAPIsMock.mockReturnValue([])

  beforeEach(() => {
    const mockGetTargetSuspensiveReactQueryVersion = vi.mocked(getTargetSuspensiveReactQueryVersion)
    mockGetTargetSuspensiveReactQueryVersion.mockReturnValue('5')

    vi.resetModules()
    vi.clearAllMocks()
  })

  describe('statusAction', () => {
    it('should display the status correctly when versions are compatible (version 4)', () => {
      const mockGetTargetSuspensiveReactQueryVersion = vi.mocked(getTargetSuspensiveReactQueryVersion)
      mockGetTargetSuspensiveReactQueryVersion.mockReturnValue('4')

      statusAction()

      expect(consoleLogSpy).toHaveBeenCalledWith(getStatusTable('4'))
    })

    it('should display the status correctly when versions are compatible (version 5)', () => {
      statusAction()

      expect(consoleLogSpy).toHaveBeenCalledWith(getStatusTable('5'))
    })

    it('should display incompatible versions message (suspensive 5, tanstack 4)', () => {
      statusAction()

      expect(consoleLogSpy).toHaveBeenCalledWith(getStatusTable('5'))
    })

    it('should display incompatible versions message (suspensive 4, tanstack 5)', () => {
      const mockGetTargetSuspensiveReactQueryVersion = vi.mocked(getTargetSuspensiveReactQueryVersion)
      mockGetTargetSuspensiveReactQueryVersion.mockReturnValue('4')

      statusAction()

      expect(consoleLogSpy).toHaveBeenCalledWith(getStatusTable('4'))
    })

    it('should handle undefined versions', () => {
      const mockGetTargetSuspensiveReactQueryVersion = vi.mocked(getTargetSuspensiveReactQueryVersion)
      mockGetTargetSuspensiveReactQueryVersion.mockReturnValue(undefined)

      statusAction()

      expect(consoleErrorSpy).toHaveBeenCalledWith('[@suspensive/react-query]', 'The version is not found.')
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

      expect(consoleWarnSpy).toHaveBeenCalledWith('[@suspensive/react-query]', 'version v1 is not supported.')
    })
  })

  describe('fixAction', () => {
    it('should not switch when versions are compatible', () => {
      fixAction()

      expect(consoleLogSpy).toHaveBeenCalledWith('[@suspensive/react-query]', 'The versions are compatible.')
      expect(switchVersion).not.toHaveBeenCalled()
    })

    it('should switch to version 5 when tanstack is 5', () => {
      vi.mocked(fs.readFileSync).mockReturnValue(`export * from '@suspensive/react-query-4'`)
      const mockGetTargetSuspensiveReactQueryVersion = vi.mocked(getTargetSuspensiveReactQueryVersion)
      mockGetTargetSuspensiveReactQueryVersion.mockReturnValue('4')

      fixAction()

      expect(consoleLogSpy).toHaveBeenCalledWith('[@suspensive/react-query]', 'Switching to the compatible version...')
      expect(switchVersion).toHaveBeenCalledWith(5)
    })
  })
})
