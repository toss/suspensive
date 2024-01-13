type Listener = () => void

export class Subscribable<TListener extends () => unknown = Listener> {
  listeners: Set<TListener>

  constructor() {
    this.listeners = new Set()
    this.subscribe = this.subscribe.bind(this)
  }

  subscribe = (listener: TListener) => {
    this.listeners.add(listener)

    return () => {
      this.listeners.delete(listener)
    }
  }
}
