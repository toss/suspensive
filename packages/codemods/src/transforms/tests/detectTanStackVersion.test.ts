import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { detectTanStackVersion, resetTanStackVersionCache } from '../utils/detectTanStackVersion'

describe('detectTanStackVersion', () => {
  let tmp: string
  let originalEnv: string | undefined

  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), 'detect-tanstack-'))
    originalEnv = process.env.SUSPENSIVE_RQ_TARGET
    delete process.env.SUSPENSIVE_RQ_TARGET
    resetTanStackVersionCache()
  })

  afterEach(() => {
    rmSync(tmp, { recursive: true, force: true })
    if (originalEnv === undefined) {
      delete process.env.SUSPENSIVE_RQ_TARGET
    } else {
      process.env.SUSPENSIVE_RQ_TARGET = originalEnv
    }
    resetTanStackVersionCache()
  })

  it('detects v4 from caret range in dependencies', () => {
    writeFileSync(join(tmp, 'package.json'), JSON.stringify({ dependencies: { '@tanstack/react-query': '^4.36.0' } }))
    expect(detectTanStackVersion(tmp)).toBe(4)
  })

  it('detects v5 from caret range in dependencies', () => {
    writeFileSync(join(tmp, 'package.json'), JSON.stringify({ dependencies: { '@tanstack/react-query': '^5.0.0' } }))
    expect(detectTanStackVersion(tmp)).toBe(5)
  })

  it('detects from devDependencies when not in dependencies', () => {
    writeFileSync(join(tmp, 'package.json'), JSON.stringify({ devDependencies: { '@tanstack/react-query': '~4.0.0' } }))
    expect(detectTanStackVersion(tmp)).toBe(4)
  })

  it('detects from peerDependencies as last resort', () => {
    writeFileSync(join(tmp, 'package.json'), JSON.stringify({ peerDependencies: { '@tanstack/react-query': '5.x' } }))
    expect(detectTanStackVersion(tmp)).toBe(5)
  })

  it('falls back to v5 with a warning when no @tanstack/react-query found', () => {
    writeFileSync(join(tmp, 'package.json'), JSON.stringify({ dependencies: {} }))
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    expect(detectTanStackVersion(tmp)).toBe(5)
    expect(warnSpy).toHaveBeenCalledOnce()
    warnSpy.mockRestore()
  })

  it('honors SUSPENSIVE_RQ_TARGET env override', () => {
    writeFileSync(join(tmp, 'package.json'), JSON.stringify({ dependencies: { '@tanstack/react-query': '^5.0.0' } }))
    process.env.SUSPENSIVE_RQ_TARGET = '4'
    expect(detectTanStackVersion(tmp)).toBe(4)
  })
})
