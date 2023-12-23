import { type ComponentProps, type ComponentType, useEffect, useReducer, useState } from 'react'
import { increase, noop } from './utils'

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

export const suspensiveDevMode = new SuspensiveDevMode()

/**
 * @experimental This is experimental feature.
 */
export const devMode = {
  /**
   * @experimental This is experimental feature.
   */
  toggle: () =>
    process.env.NODE_ENV !== 'production' ? (suspensiveDevMode.is ? devMode.off() : devMode.on()) : noop(),
  /**
   * @experimental This is experimental feature.
   */
  on: process.env.NODE_ENV !== 'production' ? suspensiveDevMode.on : noop,
  /**
   * @experimental This is experimental feature.
   */
  off: process.env.NODE_ENV !== 'production' ? suspensiveDevMode.off : noop,
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
export const DevMode = ({ position = 'bottomRight' }: DevModeProps) => {
  if (process.env.NODE_ENV !== 'production') {
    return <ModeSubscriber position={position} />
  }
  return null
}
const ModeSubscriber = ({ position }: { position: keyof typeof Position }) => {
  const [isHover, setIsHover] = useState(false)
  useDevModeObserve()
  return (
    <div
      onClick={suspensiveDevMode.is ? suspensiveDevMode.off : suspensiveDevMode.on}
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
        backgroundColor: suspensiveDevMode.is ? '#00ff4c' : '#ffffff10',
        textShadow: `0px 0px 8px ${suspensiveDevMode.is ? '#005018' : '#000'}`,
        transform: isHover ? 'scale(1.1)' : 'scale(1)',
      }}
    >
      DevMode: {suspensiveDevMode.is ? 'on' : 'off'}
    </div>
  )
}

export const useDevModeObserve = () => {
  const render = useReducer(increase, 0)[1]
  useEffect(() => suspensiveDevMode.subscribe(render), [render])
}
