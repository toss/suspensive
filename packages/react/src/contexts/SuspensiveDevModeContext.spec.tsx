import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Suspensive, SuspensiveProvider } from '../Suspensive'
import { SuspensiveDevMode, useDevModeObserve } from './SuspensiveDevModeContext'

describe('useDevModeObserve', () => {
  it('should return null if no SuspensiveProvider in parent', () => {
    const { result } = renderHook(useDevModeObserve)

    expect(result.current).toBeNull()
  })

  it('should return null if SuspensiveProvider in parent', () => {
    const suspensive = new Suspensive()
    const { result } = renderHook(useDevModeObserve, {
      wrapper: (props) => <SuspensiveProvider {...props} value={suspensive} />,
    })
    expect(result.current).toBeInstanceOf(SuspensiveDevMode)
  })
})

describe('SuspensiveDevMode', () => {
  it('should have field `is` that can be changed by on off', () => {
    const suspensiveDevMode = new SuspensiveDevMode()

    expect(suspensiveDevMode.is).toBe(false)
    suspensiveDevMode.on()
    expect(suspensiveDevMode.is).toBe(true)
    suspensiveDevMode.off()
    expect(suspensiveDevMode.is).toBe(false)
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
