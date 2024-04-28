import { sleep } from '@suspensive/test-utils'
import { waitFor } from '@testing-library/react'
import { SuspensiveDevMode, SuspensiveDevModeOnInfoText } from './SuspensiveDevModeContext'

describe('SuspensiveDevMode', () => {
  it('should have field `is` that can be changed by on off', () => {
    const devMode = new SuspensiveDevMode()

    expect(devMode.is).toBe(false)
    devMode.on()
    expect(devMode.is).toBe(true)
    devMode.off()
    expect(devMode.is).toBe(false)
  })

  it('should inform if DevMode is on by console.info', async () => {
    const devMode = new SuspensiveDevMode()
    const infoSpy = vi.spyOn(console, 'info')

    expect(devMode.is).toBe(false)
    devMode.on()
    expect(devMode.is).toBe(true)
    await waitFor(() => expect(infoSpy.mock.calls[0][0]).toBe(SuspensiveDevModeOnInfoText))
    await waitFor(() => expect(infoSpy).toBeCalledTimes(1))
    await waitFor(() => expect(infoSpy).toBeCalledTimes(2))
    await waitFor(() => expect(infoSpy).toBeCalledTimes(3))
    await waitFor(() => expect(infoSpy).toBeCalledTimes(4))
    devMode.off()
    await sleep(1000)
    expect(infoSpy).toBeCalledTimes(4)
    await sleep(1000)
    expect(infoSpy).toBeCalledTimes(4)
  })

  it('should notify that devMode have changed to subscribers', () => {
    const suspensiveDevMode = new SuspensiveDevMode()

    const subscriber = new (class Subscriber {
      notifiedCount = 0

      onChange = () => {
        this.notifiedCount = this.notifiedCount + 1
      }
    })()

    suspensiveDevMode.subscribe(subscriber.onChange)
    expect(subscriber.notifiedCount).toBe(0)
    suspensiveDevMode.on()
    expect(subscriber.notifiedCount).toBe(1)
    suspensiveDevMode.off()
    expect(subscriber.notifiedCount).toBe(2)
  })
})
