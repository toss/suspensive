import type { MockInstance } from 'vitest'
import { copy } from './copy'
import { switchVersion } from './switchVersion'

vi.mock('./copy', () => ({
  copy: vi.fn(),
}))

describe('switchVersion function', () => {
  let logSpy: MockInstance
  let warnSpy: MockInstance

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    logSpy.mockRestore()
    warnSpy.mockRestore()
  })

  it('should log success message when copy function returns true', () => {
    vi.mocked(copy).mockReturnValue(true)

    switchVersion(5)

    expect(logSpy).toHaveBeenCalledWith('[@suspensive/react-query]', 'switched to version v5')
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('should log warning message when copy function returns false', () => {
    vi.mocked(copy).mockReturnValue(false)

    switchVersion(1)

    expect(warnSpy).toHaveBeenCalledWith('[@suspensive/react-query]', 'not found version files.')
    expect(logSpy).not.toHaveBeenCalled()
  })
})
