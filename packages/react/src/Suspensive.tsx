import { type ContextType, type PropsWithChildren, useMemo } from 'react'
import { DelayDefaultPropsContext, DevModeContext, SuspenseDefaultPropsContext, SuspensiveDevMode } from './contexts'
import { assert } from './utils'
import { SuspensiveConfigDefaultPropsDelayMsShouldBeGreaterThan0 } from './utils/assert'

export class Suspensive {
  public defaultProps?: {
    suspense?: ContextType<typeof SuspenseDefaultPropsContext>
    delay?: ContextType<typeof DelayDefaultPropsContext>
  }
  public devMode = new SuspensiveDevMode()

  constructor(config: { defaultProps?: Suspensive['defaultProps'] } = {}) {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof config.defaultProps?.delay?.ms === 'number') {
        assert(config.defaultProps.delay.ms > 0, SuspensiveConfigDefaultPropsDelayMsShouldBeGreaterThan0)
      }
    }
    this.defaultProps = config.defaultProps
  }
}

interface SuspensiveProviderProps extends PropsWithChildren {
  value: Suspensive
}
export const SuspensiveProvider = ({ value, children }: SuspensiveProviderProps) => {
  const delayDefaultProps = useMemo(() => value.defaultProps?.delay || {}, [value.defaultProps?.delay])
  const suspenseDefaultProps = useMemo(() => value.defaultProps?.suspense || {}, [value.defaultProps?.suspense])

  return (
    <DevModeContext.Provider value={value.devMode}>
      <DelayDefaultPropsContext.Provider value={delayDefaultProps}>
        <SuspenseDefaultPropsContext.Provider value={suspenseDefaultProps}>
          {children}
        </SuspenseDefaultPropsContext.Provider>
      </DelayDefaultPropsContext.Provider>
    </DevModeContext.Provider>
  )
}
