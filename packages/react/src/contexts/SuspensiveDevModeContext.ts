import { createContext, useContext, useEffect, useReducer } from 'react'
import { increase } from '../utils'

export const SuspensiveDevModeContext = createContext<SuspensiveDevMode | null>(null)
export const useDevModeObserve = () => {
  const suspensiveDevMode = useContext(SuspensiveDevModeContext)
  const render = useReducer(increase, 0)[1]
  useEffect(() => suspensiveDevMode?.subscribe(render), [suspensiveDevMode, render])

  return suspensiveDevMode
}

type Sync = () => void
export class SuspensiveDevMode {
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
