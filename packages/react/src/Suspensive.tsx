import { type ContextType, type PropsWithChildren, useMemo } from 'react'
import { DelayDefaultPropsContext, DevModeContext, SuspenseDefaultPropsContext, SuspensiveDevMode } from './contexts'
import {
  Message_Suspensive_config_defaultProps_delay_ms_should_be_greater_than_0,
  SuspensiveError,
} from './models/SuspensiveError'

export class Suspensive {
  public defaultProps?: {
    suspense?: ContextType<typeof SuspenseDefaultPropsContext>
    delay?: ContextType<typeof DelayDefaultPropsContext>
  }
  public devMode = new SuspensiveDevMode()

  constructor(config: { defaultProps?: Suspensive['defaultProps'] } = {}) {
    if (process.env.NODE_ENV === 'development' && typeof config.defaultProps?.delay?.ms === 'number') {
      SuspensiveError.assert(
        config.defaultProps.delay.ms > 0,
        Message_Suspensive_config_defaultProps_delay_ms_should_be_greater_than_0
      )
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
