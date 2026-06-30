import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Mock } from 'vitest'
import { detectTanStackVersion, resetTanStackVersionCache } from './detectTanStackVersion'

vi.mock('node:fs', () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
}))

const mockExistsSync = existsSync as Mock
const mockReadFileSync = readFileSync as Mock

function setupPackageJson(packages: Record<string, Record<string, unknown>>) {
  mockExistsSync.mockImplementation((path: string) => path in packages)
  mockReadFileSync.mockImplementation((path: string) => {
    if (path in packages) return JSON.stringify(packages[path])
    throw new Error(`ENOENT: ${path}`)
  })
}

describe('detectTanStackVersion', () => {
  const originalEnv = process.env.SUSPENSIVE_RQ_TARGET
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

  beforeEach(() => {
    vi.clearAllMocks()
    resetTanStackVersionCache()
    delete process.env.SUSPENSIVE_RQ_TARGET
  })

  afterAll(() => {
    if (originalEnv === undefined) {
      delete process.env.SUSPENSIVE_RQ_TARGET
    } else {
      process.env.SUSPENSIVE_RQ_TARGET = originalEnv
    }
    warnSpy.mockRestore()
  })

  it('returns the SUSPENSIVE_RQ_TARGET env override when set to a valid number', () => {
    process.env.SUSPENSIVE_RQ_TARGET = '4'
    expect(detectTanStackVersion('/project')).toBe(4)
    expect(mockExistsSync).not.toHaveBeenCalled()
  })

  it('ignores the env override when it is not a number', () => {
    process.env.SUSPENSIVE_RQ_TARGET = 'not-a-number'
    setupPackageJson({
      [join('/project', 'package.json')]: {
        dependencies: { '@tanstack/react-query': '^5.0.0' },
      },
    })
    expect(detectTanStackVersion('/project')).toBe(5)
  })

  it('detects version from dependencies', () => {
    setupPackageJson({
      [join('/project', 'package.json')]: {
        dependencies: { '@tanstack/react-query': '^5.10.0' },
      },
    })
    expect(detectTanStackVersion('/project')).toBe(5)
  })

  it('detects version from devDependencies', () => {
    setupPackageJson({
      [join('/project', 'package.json')]: {
        devDependencies: { '@tanstack/react-query': '~4.36.1' },
      },
    })
    expect(detectTanStackVersion('/project')).toBe(4)
  })

  it('detects version from peerDependencies', () => {
    setupPackageJson({
      [join('/project', 'package.json')]: {
        peerDependencies: { '@tanstack/react-query': '>=3.0.0' },
      },
    })
    expect(detectTanStackVersion('/project')).toBe(3)
  })

  it('prefers dependencies over devDependencies and peerDependencies', () => {
    setupPackageJson({
      [join('/project', 'package.json')]: {
        dependencies: { '@tanstack/react-query': '^5.0.0' },
        devDependencies: { '@tanstack/react-query': '^4.0.0' },
        peerDependencies: { '@tanstack/react-query': '^3.0.0' },
      },
    })
    expect(detectTanStackVersion('/project')).toBe(5)
  })

  it('walks up directories to find a package.json with the dependency', () => {
    setupPackageJson({
      [join('/root', 'package.json')]: {
        dependencies: { '@tanstack/react-query': '^4.0.0' },
      },
      [join('/root/packages/app', 'package.json')]: {
        dependencies: { react: '^18.0.0' },
      },
    })
    expect(detectTanStackVersion('/root/packages/app')).toBe(4)
  })

  it('defaults to v5 and warns when no package.json declares the dependency', () => {
    mockExistsSync.mockReturnValue(false)
    expect(detectTanStackVersion('/nowhere')).toBe(5)
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Could not detect'))
  })

  it('defaults to v5 and warns when the range has no parseable major number', () => {
    setupPackageJson({
      [join('/project', 'package.json')]: {
        dependencies: { '@tanstack/react-query': 'workspace:*' },
      },
    })
    expect(detectTanStackVersion('/project')).toBe(5)
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Could not parse major version'))
  })

  it('skips package.json files that fail to parse and continues walking up', () => {
    mockExistsSync.mockImplementation(
      (path: string) => path === join('/root/app', 'package.json') || path === join('/root', 'package.json')
    )
    mockReadFileSync.mockImplementation((path: string) => {
      if (path === join('/root/app', 'package.json')) return '{ invalid json'
      if (path === join('/root', 'package.json')) {
        return JSON.stringify({ dependencies: { '@tanstack/react-query': '^4.0.0' } })
      }
      throw new Error(`ENOENT: ${path}`)
    })
    expect(detectTanStackVersion('/root/app')).toBe(4)
  })

  it('caches the detected version across calls', () => {
    setupPackageJson({
      [join('/project', 'package.json')]: {
        dependencies: { '@tanstack/react-query': '^5.0.0' },
      },
    })
    expect(detectTanStackVersion('/project')).toBe(5)
    const callCount = mockExistsSync.mock.calls.length
    expect(detectTanStackVersion('/project')).toBe(5)
    expect(mockExistsSync.mock.calls.length).toBe(callCount)
  })

  it('resetTanStackVersionCache forces re-detection', () => {
    setupPackageJson({
      [join('/project', 'package.json')]: {
        dependencies: { '@tanstack/react-query': '^5.0.0' },
      },
    })
    expect(detectTanStackVersion('/project')).toBe(5)

    resetTanStackVersionCache()
    setupPackageJson({
      [join('/project', 'package.json')]: {
        dependencies: { '@tanstack/react-query': '^4.0.0' },
      },
    })
    expect(detectTanStackVersion('/project')).toBe(4)
  })

  it('uses process.cwd() as the default start directory', () => {
    const cwd = process.cwd()
    setupPackageJson({
      [join(cwd, 'package.json')]: {
        dependencies: { '@tanstack/react-query': '^5.0.0' },
      },
    })
    expect(detectTanStackVersion()).toBe(5)
  })
})
