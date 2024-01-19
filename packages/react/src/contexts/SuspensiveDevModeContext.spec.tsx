import { TEXT, sleep } from '@suspensive/test-utils'
import { render, renderHook, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createElement, useContext } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { DevMode } from '../DevMode'
import { Suspensive, SuspensiveProvider } from '../Suspensive'
import { DevModeContext, SuspensiveDevMode, SuspensiveDevModeOnInfoText, syncDevMode } from './SuspensiveDevModeContext'

describe('SuspensiveDevMode (process.env.NODE_ENV: development)', () => {
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

  describe('DevModeContext', () => {
    it('returns null when no SuspensiveProvider is present', () => {
      const { result } = renderHook(() => useContext(DevModeContext))
      expect(result.current).toBeNull()
    })

    it('returns an instance of SuspensiveDevMode when wrapped with SuspensiveProvider', () => {
      const { result } = renderHook(() => useContext(DevModeContext), {
        wrapper: (props) => <SuspensiveProvider {...props} value={new Suspensive()} />,
      })
      expect(result.current).toBeInstanceOf(SuspensiveDevMode)
    })
  })

  describe('syncDevMode (process.env.NODE_ENV: development)', () => {
    it('should make component synced with DevMode at development', async () => {
      const user = userEvent.setup()
      const logSpy = vi.spyOn(console, 'log')
      render(
        createElement(
          syncDevMode(({ devMode }) => {
            console.log(devMode.is)
            return <>{TEXT}</>
          })
        ),
        {
          wrapper: ({ children }) => (
            <SuspensiveProvider value={new Suspensive()}>
              {children}
              <DevMode />
            </SuspensiveProvider>
          ),
        }
      )
      // expect(screen.queryByText(TEXT)).toBeInTheDocument()
      expect(logSpy.mock.calls[0][0]).toBe(false)
      user.click(screen.getByRole('Suspensive.DevMode-off'))
      await waitFor(() => expect(logSpy.mock.calls[1][0]).toBe(true))
      user.click(screen.getByRole('Suspensive.DevMode-on'))
      await waitFor(() => expect(logSpy.mock.calls[2][0]).toBe(false))
      await waitFor(() => expect(logSpy.mock.calls[3]).toBe(undefined))
    })
  })
})
