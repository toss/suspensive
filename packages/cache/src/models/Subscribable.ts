type Listener = (...args: any[]) => unknown

export class Subscribable<TListener extends Listener> {
  protected listeners = new Set<TListener>()

  constructor() {
    this.subscribe = this.subscribe.bind(this)
  }

  public subscribe(linstener: TListener) {
    this.listeners.add(linstener)

    const unsubscribe = () => {
      this.listeners.delete(linstener)
    }
    return unsubscribe
  }

  protected notify = () => {
    this.listeners.forEach((listener) => listener())
  }
}
