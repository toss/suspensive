import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import type { ComponentProps, ComponentType, ContextType, PropsWithChildren } from 'react'
import { DelayDefaultOptionsContext, SuspenseDefaultOptionsContext } from './contexts'
import { increase } from './utils'

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

/**
 * @experimental This is experimental feature.
 */
export type PropsWithoutDevMode<TProps extends ComponentProps<ComponentType>> = Omit<TProps, 'devMode'>

/**
 * @experimental This is experimental feature.
 */
export type PropsWithDevMode<TDevModeProps extends Record<string, any>> = {
  /**
   * @experimental This is experimental feature.
   */
  devMode?: TDevModeProps
}

type Sync = () => void
class SuspensiveDevMode {
  constructor(public is = false) {}
  private syncs = new Map<Sync, Sync>()
  on = () => {
    if (process.env.NODE_ENV !== 'production') {
      this.is = true
      this.syncSubscriber()
    }
  }
  off = () => {
    if (process.env.NODE_ENV !== 'production') {
      this.is = false
      this.syncSubscriber()
    }
  }
  subscribe = (sync: Sync) => {
    if (process.env.NODE_ENV !== 'production') {
      this.syncs.set(sync, sync)
    }

    return () => this.unsubscribe(sync)
  }
  unsubscribe = (sync: Sync) => {
    if (process.env.NODE_ENV !== 'production') {
      this.syncs.delete(sync)
    }
  }
  syncSubscriber = () => this.syncs.forEach((sync) => sync())
}

const Position = {
  bottomLeft: { bottom: 20, left: 20 },
  bottomRight: { bottom: 20, right: 20 },
  topLeft: { top: 20, left: 20 },
  topRight: { top: 20, right: 20 },
} as const
interface DevModeProps {
  /**
   * @experimental This is experimental feature.
   */
  position?: keyof typeof Position
}
/**
 * @experimental This is experimental feature.
 */
export const SuspensiveDevTools = ({ position = 'bottomRight' }: DevModeProps) => {
  if (process.env.NODE_ENV !== 'production') {
    return <ModeSubscriber position={position} />
  }
  return null
}

const ModeSubscriber = ({ position }: { position: keyof typeof Position }) => {
  const [isHover, setIsHover] = useState(false)
  const devMode = useDevModeObserve()
  if (devMode == null) {
    return null
  }
  return (
    <div
      onClick={devMode.is ? devMode.off : devMode.on}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{
        position: 'fixed',
        border: '1px solid #ffffff60',
        padding: '8px 16px',
        borderRadius: 8,
        fontSize: 8,
        cursor: 'pointer',
        color: 'white',
        fontWeight: 900,
        transition: 'all 200ms',
        ...Position[position],
        backgroundColor: devMode.is ? '#00ff4c' : '#ffffff10',
        textShadow: `0px 0px 8px ${devMode.is ? '#005018' : '#000'}`,
        transform: isHover ? 'scale(1.1)' : 'scale(1)',
      }}
    >
      Suspensive.DevMode: {devMode.is ? 'on' : 'off'}
    </div>
  )
}

const SuspensiveDevModeContext = createContext<SuspensiveDevMode | null>(null)
export const useDevModeObserve = () => {
  const devMode = useContext(SuspensiveDevModeContext)
  const render = useReducer(increase, 0)[1]
  useEffect(() => devMode?.subscribe(render), [devMode, render])

  return devMode
}
