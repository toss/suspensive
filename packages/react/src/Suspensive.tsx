import { type ContextType, type PropsWithChildren, useMemo } from 'react'
import {
  DelayDefaultOptionsContext,
  SuspenseDefaultOptionsContext,
  SuspensiveDevMode,
  SuspensiveDevModeContext,
} from './contexts'

export class Suspensive {
  public defaultOptions?: {
    suspense?: ContextType<typeof SuspenseDefaultOptionsContext>
    delay?: ContextType<typeof DelayDefaultOptionsContext>
  }
  public devMode = new SuspensiveDevMode()

  constructor(config: { defaultOptions?: Suspensive['defaultOptions'] } = {}) {
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
    <SuspensiveDevModeContext.Provider value={value.devMode}>
      <DelayDefaultOptionsContext.Provider value={delayDefaultOptions}>
        <SuspenseDefaultOptionsContext.Provider value={suspenseDefaultOptions}>
          {children}
        </SuspenseDefaultOptionsContext.Provider>
      </DelayDefaultOptionsContext.Provider>
    </SuspensiveDevModeContext.Provider>
  )
}
