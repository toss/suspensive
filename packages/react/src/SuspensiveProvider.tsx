import { ContextType, ReactNode, useMemo } from 'react'
import { DelayContext } from './Delay'
import { SuspenseContext } from './Suspense'

type Configs = {
  defaultOptions?: {
    suspense?: ContextType<typeof SuspenseContext>
    delay?: ContextType<typeof DelayContext>
  }
}

/**
 * @experimental This is experimental feature.
 */
export class SuspensiveConfigs {
  public defaultOptions?: Configs['defaultOptions']

  constructor(config: Configs = {}) {
    this.defaultOptions = config.defaultOptions
  }
}

/**
 * @experimental This is experimental feature.
 */
export const SuspensiveProvider = ({ configs, children }: { configs: SuspensiveConfigs; children: ReactNode }) => {
  const delayValue = useMemo(() => configs.defaultOptions?.delay || {}, [])
  const suspenseValue = useMemo(() => configs.defaultOptions?.suspense || {}, [])

  return (
    <DelayContext.Provider value={delayValue}>
      <SuspenseContext.Provider value={suspenseValue}>{children}</SuspenseContext.Provider>
    </DelayContext.Provider>
  )
}
