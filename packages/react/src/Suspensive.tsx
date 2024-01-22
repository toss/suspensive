import { type ContextType, type PropsWithChildren, useMemo } from 'react'
import { AssertionError } from './AssertionError'
import { DelayDefaultPropsContext, DevModeContext, SuspenseDefaultPropsContext, SuspensiveDevMode } from './contexts'
import { SuspensiveConfigDefaultOptionsDelayMsShouldBeGreaterThan0 } from './utils/assert'

export class Suspensive {
  public defaultOptions?: {
    suspense?: ContextType<typeof SuspenseDefaultPropsContext>
    delay?: ContextType<typeof DelayDefaultPropsContext>
  }
  public devMode = new SuspensiveDevMode()

  constructor(config: { defaultOptions?: Suspensive['defaultOptions'] } = {}) {
    if (process.env.NODE_ENV === 'development' && typeof config.defaultOptions?.delay?.ms === 'number') {
      AssertionError.assert(
        config.defaultOptions.delay.ms > 0,
        SuspensiveConfigDefaultOptionsDelayMsShouldBeGreaterThan0
      )
    }
    this.defaultOptions = config.defaultOptions
  }
}

interface SuspensiveProviderProps extends PropsWithChildren {
  value: Suspensive
}
export const SuspensiveProvider = ({ value, children }: SuspensiveProviderProps) => {
  const delayDefaultOptions = useMemo(() => value.defaultOptions?.delay || {}, [value.defaultOptions?.delay])
  const suspenseDefaultOptions = useMemo(() => value.defaultOptions?.suspense || {}, [value.defaultOptions?.suspense])

  return (
    <DevModeContext.Provider value={value.devMode}>
      <DelayDefaultPropsContext.Provider value={delayDefaultOptions}>
        <SuspenseDefaultPropsContext.Provider value={suspenseDefaultOptions}>
          {children}
        </SuspenseDefaultPropsContext.Provider>
      </DelayDefaultPropsContext.Provider>
    </DevModeContext.Provider>
  )
}
