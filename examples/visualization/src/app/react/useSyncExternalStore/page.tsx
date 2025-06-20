'use client'
import React, { useState, useSyncExternalStore } from 'react'

export default function Page() {
  const [store] = useState(new Store())
  const state = useSyncExternalStore(
    store.subscribe,
    () => store.state,
    () => store.state
  )

  console.log('render')

  return (
    <div>
      <div>State: {state}</div>

      <button type="button" onClick={() => store.set(1)}>
        1
      </button>
      <button type="button" onClick={() => store.set(2)}>
        2
      </button>
      <button type="button" onClick={() => store.set(3)}>
        3
      </button>
      <button type="button" onClick={() => store.set(4)}>
        4
      </button>
    </div>
  )
}

class Subscribable<TListener extends (...args: any[]) => unknown> {
  listeners = new Set<TListener>()
  subscribe = (listener: TListener) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }
  notify = () => this.listeners.forEach((listener) => listener())
}

class Store extends Subscribable<() => void> {
  state = 0
  set(num: number) {
    this.state = num
    this.notify()
  }
}
