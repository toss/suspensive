import { TEXT } from '@suspensive/utils'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createElement } from 'react'
import { DevMode } from '../DevMode'
import { Suspensive, SuspensiveProvider } from '../Suspensive'
import { syncDevMode } from './SuspensiveDevModeContext'

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
    expect(logSpy.mock.calls[0][0]).toBe(false)
    user.click(screen.getByRole('Suspensive.DevMode-off'))
    await waitFor(() => expect(logSpy.mock.calls[1][0]).toBe(true))
    user.click(screen.getByRole('Suspensive.DevMode-on'))
    await waitFor(() => expect(logSpy.mock.calls[2][0]).toBe(false))
    await waitFor(() => expect(logSpy.mock.calls[3]).toBe(undefined))
  })
})
