const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), ms))

describe('real timers', () => {
  test('sleep should be not good to test', async () => {
    const startDate = new Date()
    await sleep(10000)

    expect(new Date().getTime() - startDate.getTime()).toBe(10000)
  })
  test('should be not good to test', async () => {
    let i = 0
    setInterval(() => ++i, 10)
    await sleep(1000)
    expect(i).toBe(1000 / 10)
  })
})

describe('fake timers', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be good to test', async () => {
    const startDate = new Date()
    await vi.advanceTimersByTimeAsync(10000)
    expect(new Date().getTime() - startDate.getTime()).toBe(10000)
  })

  test('should be not good to test', async () => {
    let i = 0
    setInterval(() => ++i, 10)
    await vi.advanceTimersByTimeAsync(1000)
    expect(i).toBe(1000 / 10)
  })
})
