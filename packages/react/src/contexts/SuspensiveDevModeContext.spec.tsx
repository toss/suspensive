import { renderHook } from '@testing-library/react'
import { useContext } from 'react'
import { describe, expect, it } from 'vitest'
import { Suspensive, SuspensiveProvider } from '../Suspensive'
import { DevModeContext, SuspensiveDevMode } from './SuspensiveDevModeContext'

describe('SuspensiveDevMode', () => {
  it('should have field `is` that can be changed by on off', () => {
    const devMode = new SuspensiveDevMode()

    expect(devMode.is).toBe(false)
    devMode.on()
    expect(devMode.is).toBe(true)
    devMode.off()
    expect(devMode.is).toBe(false)
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

  describe("DevModeContext", () => {
    it("returns null when no SuspensiveProvider is present", () => {
      const { result } = renderHook(() => useContext(DevModeContext))
      expect(result.current).toBeNull()
    })

    it("returns an instance of SuspensiveDevMode when wrapped with SuspensiveProvider", () => {
      const { result } = renderHook(() => useContext(DevModeContext), {
        wrapper: (props) => (
          <SuspensiveProvider {...props} value={new Suspensive()} />
        ),
      })
      expect(result.current).toBeInstanceOf(SuspensiveDevMode)
    })
  })
})
