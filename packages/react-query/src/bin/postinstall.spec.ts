import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getTanStackReactQueryPackageJson } from './utils/package'
import { switchVersion } from './utils/switchVersion'

vi.mock('./utils/package')
vi.mock('./utils/switchVersion')

describe('postinstall', () => {
  const mockConsoleError = vi.spyOn(console, 'error')
  const mockGetTanStackReactQueryPackageJson = vi.mocked(getTanStackReactQueryPackageJson)
  const mockSwitchVersion = vi.mocked(switchVersion)

  const runPostInstall = async (version: string) => {
    mockGetTanStackReactQueryPackageJson.mockReturnValue({
      name: 'tanstack-query',
      version,
      description: `TanStack Query v${version.split('.')[0]}`,
    })

    await import('./postinstall')
  }

  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it.each(['^4.2.3', '4.2.3', '^4', '4', '4.1', '^4.2.3-next.3'] as const)(
    'should switch to @suspensive/react-query-4 when @tanstack/react-query@^4 is installed',
    async (packageJsonVersion) => {
      await runPostInstall(packageJsonVersion)

      expect(mockGetTanStackReactQueryPackageJson).toHaveBeenCalledTimes(1)
      expect(mockSwitchVersion).toHaveBeenCalledWith(4)
      expect(mockSwitchVersion).toHaveBeenCalledTimes(1)
      expect(mockConsoleError).not.toHaveBeenCalled()
    }
  )

  it.each(['^5.2.3', '5.2.3', '^5', '5', '5.1', '^5.2.3-next.3'])(
    'should switch to @suspensive/react-query-5 when @tanstack/react-query@^5 is installed',
    async (packageJsonVersion) => {
      await runPostInstall(packageJsonVersion)

      expect(mockGetTanStackReactQueryPackageJson).toHaveBeenCalledTimes(1)
      expect(mockSwitchVersion).toHaveBeenCalledWith(5)
      expect(mockSwitchVersion).toHaveBeenCalledTimes(1)
      expect(mockConsoleError).not.toHaveBeenCalled()
    }
  )

  it('should show warning when unsupported version is installed', async () => {
    await runPostInstall('3.3.4')

    expect(mockGetTanStackReactQueryPackageJson).toHaveBeenCalledTimes(1)
    expect(mockSwitchVersion).not.toHaveBeenCalled()
    expect(mockConsoleError).toHaveBeenCalledWith(
      '[@suspensive/react-query]',
      '@tanstack/react-query@3.3.4 is not supported.'
    )
  })
})
