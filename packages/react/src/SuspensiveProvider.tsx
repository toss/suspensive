import { type ContextType, type PropsWithChildren, useMemo } from 'react'
import { DelayDefaultOptionsContext, SuspenseDefaultOptionsContext } from './contexts'

interface Configs {
  defaultOptions?: {
    suspense?: ContextType<typeof SuspenseDefaultOptionsContext>
    delay?: ContextType<typeof DelayDefaultOptionsContext>
  }
}

export class Suspensive implements Configs {
  public defaultOptions

  constructor(config: Configs = {}) {
    this.defaultOptions = config.defaultOptions
  }
}

interface SuspensiveProviderProps extends PropsWithChildren {
  value: Suspensive
}
export const SuspensiveProvider = ({ value, children }: SuspensiveProviderProps) => {
  const delayDefaultOptionsValue = useMemo(() => value.defaultOptions?.delay || {}, [value.defaultOptions?.delay])
  const suspenseDefaultOptionsValue = useMemo(
    () => value.defaultOptions?.suspense || {},
    [value.defaultOptions?.suspense]
  )

  return (
    <DelayDefaultOptionsContext.Provider value={delayDefaultOptionsValue}>
      <SuspenseDefaultOptionsContext.Provider value={suspenseDefaultOptionsValue}>
        {children}
      </SuspenseDefaultOptionsContext.Provider>
    </DelayDefaultOptionsContext.Provider>
  )
}
