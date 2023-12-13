import { useEffect, useReducer } from 'react'
import type { ComponentProps } from 'react'
import { Delay } from './Delay'
import { useErrorBoundary } from './ErrorBoundary'
import { increase, noop } from './utils'

type Sync = () => void
class SuspensiveDevMode {
  constructor(public is = process.env.NODE_ENV !== 'production') {}
  private syncs = new Map<Sync, Sync>()
  on = () => {
    this.is = true
    this.syncSubscriber()
  }
  off = () => {
    this.is = false
    this.syncSubscriber()
  }
  subscribe = (sync: Sync) => {
    this.syncs.set(sync, sync)

    return () => this.unsubscribe(sync)
  }
  unsubscribe = (sync: Sync) => {
    this.syncs.delete(sync)
  }
  syncSubscriber = () => this.syncs.forEach((sync) => sync())
}

const devMode = new SuspensiveDevMode()
/**
 * @experimental This is experimental feature.
 */
export const DevMode = Object.assign(
  ({ position = 'bottomRight' }: Partial<Pick<ComponentProps<typeof ModeSubscriber>, 'position'>>) => {
    if (process.env.NODE_ENV !== 'production') {
      return <ModeSubscriber position={position} />
    }
    return null
  },
  {
    /**
     * @experimental This is experimental feature.
     */
    on: devMode.on,
    /**
     * @experimental This is experimental feature.
     */
    off: devMode.off,
    /**
     * @experimental This is experimental feature.
     */
    Suspense: ({ showFallback = false }: { showFallback?: boolean }) => {
      if (process.env.NODE_ENV !== 'production' && devMode.is && showFallback) {
        throw new Promise(noop)
      }
      return null
    },
    /**
     * @experimental This is experimental feature.
     */
    ErrorBoundary: ({
      showFallback = false,
      errorMessage = `<DevMode.ErrorBoundary> set Error ErrorBoundary`,
      after = 0,
    }: {
      showFallback?: boolean
      errorMessage?: string
      after?: number
    }) => {
      if (process.env.NODE_ENV !== 'production' && devMode.is && showFallback) {
        return (
          <Delay ms={after}>
            <SetError errorMessage={errorMessage} />
          </Delay>
        )
      }
      return null
    },
  }
)
const SetError = ({ errorMessage = `<DevMode.ErrorBoundary> set Error ErrorBoundary` }: { errorMessage: string }) => {
  const errorBoundary = useErrorBoundary()
  errorBoundary.setError(new Error(errorMessage))
  return <></>
}

const Position = {
  bottomLeft: { bottom: 20, left: 20 },
  bottomRight: { bottom: 20, right: 20 },
  topLeft: { top: 20, right: 20 },
  topRight: { top: 20, left: 20 },
} as const
const ModeSubscriber = ({ position }: { position: keyof typeof Position }) => {
  const render = useReducer(increase, 0)[1]
  useEffect(() => devMode.subscribe(render), [render])
  return (
    <div
      onClick={devMode.is ? devMode.off : devMode.on}
      style={{
        position: 'fixed',
        border: '1px solid #ffffff60',
        padding: '8px 16px',
        borderRadius: 8,
        fontSize: 8,
        cursor: 'pointer',
        ...Position[position],
        backgroundColor: devMode.is ? '#00ff4c' : '#ffffff10',
        color: 'white',
      }}
    >
      DevMode: {devMode.is ? 'on' : 'off'}
    </div>
  )
}
