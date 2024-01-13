import { type ComponentProps, type ComponentType, createContext, createElement, useContext } from 'react'
import { useSyncExternalStore } from 'use-sync-external-store/shim/index.js'
import { Subscribable } from '../models/Subscribable'
import { noop } from '../utils/noop'

export const DevModeContext = createContext<SuspensiveDevMode | null>(null)

export const syncDevMode = <TProps extends ComponentProps<ComponentType>>(
  Component: ComponentType<TProps & { devMode: SuspensiveDevMode }>
) => {
  const SyncDevMode = (props: TProps & { devMode: SuspensiveDevMode }) => {
    useSyncExternalStore(props.devMode.subscribe, () => props.devMode.is)
    return createElement(Component, props)
  }
  return process.env.NODE_ENV !== 'production'
    ? (props: TProps) => {
        const devMode = useContext(DevModeContext)
        return devMode ? createElement(SyncDevMode, { ...props, devMode }) : null
      }
    : () => null
}

export class SuspensiveDevMode extends Subscribable {
  promise = new Promise(noop)
  is = false
  on = () => {
    this.is = true
    this.promise = new Promise<void>((resolve) => {
      const timeout = setInterval(() => {
        if (this.is) {
          return console.info('[Suspensive] DevMode is now working', new Date())
        }
        resolve()
        clearInterval(timeout)
      }, 500)
    })
    this.notify()
  }
  off = () => {
    this.is = false
    this.promise = new Promise(noop)
    this.notify()
  }
  notify = () => this.listeners.forEach((listener) => listener())
}
