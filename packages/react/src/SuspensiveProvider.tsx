import type { ContextType, PropsWithChildren } from 'react'
import { useMemo } from 'react'
import { DelayContext } from './Delay'
import { SuspenseContext } from './Suspense'

interface Configs {
  defaultOptions?: {
    suspense?: ContextType<typeof SuspenseContext>
    delay?: ContextType<typeof DelayContext>
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
  const delayValue = useMemo(() => value.defaultOptions?.delay || {}, [value.defaultOptions?.delay])
  const suspenseValue = useMemo(() => value.defaultOptions?.suspense || {}, [value.defaultOptions?.suspense])

  return (
    <DelayContext.Provider value={delayValue}>
      <SuspenseContext.Provider value={suspenseValue}>{children}</SuspenseContext.Provider>
    </DelayContext.Provider>
  )
}
