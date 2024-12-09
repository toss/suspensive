import { logger } from './logger'

describe('logger', () => {
  const LOG_PREFIX = '[@suspensive/react-query]'
  const consoleLogSpy = vi.spyOn(console, 'log').mockClear()
  const consoleWarnSpy = vi.spyOn(console, 'warn').mockClear()

  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('should log a message with console.log', () => {
    const testMessage = 'test message'
    logger.log(testMessage)

    expect(consoleLogSpy).toHaveBeenCalledWith(LOG_PREFIX, testMessage)
  })

  it('should log a warning with console.warn', () => {
    const testMessage = 'error message'
    logger.error(testMessage)

    expect(consoleWarnSpy).toHaveBeenCalledWith(LOG_PREFIX, testMessage)
  })
})
