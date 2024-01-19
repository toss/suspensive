import { TEXT } from '@suspensive/test-utils'
import { render, screen } from '@testing-library/react'
import { createElement } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { DevMode } from '../DevMode'
import { Suspensive, SuspensiveProvider } from '../Suspensive'
import { syncDevMode } from './SuspensiveDevModeContext'

describe('SuspensiveDevMode (process.env.NODE_ENV: production)', () => {
  describe('syncDevMode', () => {
    it('should make component synced with DevMode in production mode', () => {
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
      expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
      expect(logSpy).not.toBeCalled()
      process.env.NODE_ENV = undefined
    })
  })
})
