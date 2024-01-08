import type { AwaitClient } from './AwaitClient'
import { Subscribable } from './models'
import type { AwaitOptions, Key } from './types'

export class AwaitObserver<TData, TKey extends Key = Key> extends Subscribable {
  constructor(
    client: AwaitClient,
    private options: AwaitOptions<TData, TKey>
  ) {
    super()
  }
}
