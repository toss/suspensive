type Listener = (...args: any[]) => unknown

type Unsubscribe = () => void
type Subscribe<TListener extends Listener> = (listener: TListener) => Unsubscribe

export class Subscribable<TListener extends Listener> {
  protected listeners = new Set<TListener>()

  public subscribe: Subscribe<TListener> = (listener) => {
    this.listeners.add(listener)

    const unsubscribe = (): void => {
      this.listeners.delete(listener)
    }
    return unsubscribe
  }

  protected notify = (): void => this.listeners.forEach((listener) => listener())
}
