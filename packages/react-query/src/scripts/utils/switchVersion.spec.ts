import type { MockInstance } from 'vitest'
import { copy } from './copy'
import { switchVersion } from './switchVersion'

vi.mock('./copy', () => ({
  copy: vi.fn(),
}))

describe('switchVersion', () => {
  let consoleLogSpy: MockInstance
  let consoleWarnSpy: MockInstance

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should log success message when copy function returns true', () => {
    vi.mocked(copy).mockReturnValue(true)

    switchVersion(5)

    expect(consoleLogSpy).toHaveBeenCalledWith('[@suspensive/react-query]', 'switched to version v5')
    expect(consoleWarnSpy).not.toHaveBeenCalled()
  })

  it('should log warning message when copy function returns false', () => {
    vi.mocked(copy).mockReturnValue(false)

    switchVersion(1)

    expect(consoleWarnSpy).toHaveBeenCalledWith('[@suspensive/react-query]', 'not found version files.')
    expect(consoleLogSpy).not.toHaveBeenCalled()
  })
})
