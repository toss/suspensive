import { type ComponentProps, type ComponentType, createContext, createElement, useContext } from 'react'
// https://github.com/suspensive/react/pull/203
// https://github.com/TanStack/query/blob/v4/packages/react-query/src/useSyncExternalStore.ts
import { useSyncExternalStore } from 'use-sync-external-store/shim/index.js'
import { Subscribable } from '../models/Subscribable'
import type { Nullable } from '../utility-types'
import { noop } from '../utils/noop'

export const DevModeContext = createContext<Nullable<SuspensiveDevMode>>(null)

type SyncDevMode = <TProps extends ComponentProps<ComponentType>>(
  Component: ComponentType<TProps & { devMode: SuspensiveDevMode }>
) => (props: TProps) => Nullable<
  React.FunctionComponentElement<
    TProps & {
      devMode: SuspensiveDevMode
    }
  >
>

export const syncDevMode: SyncDevMode =
  process.env.NODE_ENV === 'development'
    ? <TProps extends ComponentProps<ComponentType>>(
        Component: ComponentType<TProps & { devMode: SuspensiveDevMode }>
      ) => {
        const Wrapped = (props: TProps & { devMode: SuspensiveDevMode }) => {
          useSyncExternalStore(
            props.devMode.subscribe,
            () => props.devMode.is,
            () => props.devMode.is
          )
          return createElement(Component, props)
        }
        const WrappedWrapped = (props: TProps) => {
          const devMode = useContext(DevModeContext)
          return devMode ? createElement(Wrapped, { ...props, devMode }) : null
        }
        return WrappedWrapped
      }
    : () => () => null

export const SuspensiveDevModeOnInfoText = '[Suspensive] DevMode is now working'

export class SuspensiveDevMode extends Subscribable {
  promise = new Promise(noop)
  is = false
  on = () => {
    this.is = true
    this.promise = new Promise<void>((resolve) => {
      const timeout = setInterval(() => {
        if (this.is) {
          return console.info(SuspensiveDevModeOnInfoText, new Date())
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
