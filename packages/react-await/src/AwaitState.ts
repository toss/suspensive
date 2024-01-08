import type { AwaitClient } from './AwaitClient'
import { GarbageCollectable } from './models'
import type { AwaitOptions, HashedKey, Key } from './types'
import { hashKey } from './utils'

export class AwaitState<TData = unknown, TKey extends Key = Key> extends GarbageCollectable {
  private key: TKey
  private hashedKey: HashedKey
  public promise?: Promise<TData> | undefined
  public error?: unknown
  public data!: TData
  public fn: (context: { key: TKey }) => Promise<TData>

  constructor(
    options: AwaitOptions<TData, TKey>,
    private awaitClient: AwaitClient
  ) {
    super()
    this.updateGcTime(options.gcTime)
    this.key = options.key
    this.hashedKey = hashKey(options.key)
    this.fn = options.fn

    this.await()
  }

  public await = () => {
    this.promise = this.fn({ key: this.key }).then((data) => {
      this.data = data
      return data
    })
    this.promise.catch((error) => {
      this.error = error
    })
    this.scheduleGc()
    this.awaitClient.syncSubscribers()
  }

  public reset = () => this.awaitClient.reset(this.key)

  protected gc = () => {
    this.await()
    // this.awaitClient.syncSubscribers(this.key)
  }
}
