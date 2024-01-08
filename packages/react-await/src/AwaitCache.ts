import { Subscribable } from './models'
import type { hashKey } from './utils'

export class AwaitCache extends Subscribable {
  private awaits: Map<ReturnType<typeof hashKey>, Await>

  constructor(public config: QueryCacheConfig = {}) {
    super()
    this.#queries = new Map<string, Query>()
  }

  build<TQueryFnData, TError, TData, TQueryKey extends QueryKey>(
    client: QueryClient,
    options: QueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    state?: QueryState<TData, TError>
  ): Query<TQueryFnData, TError, TData, TQueryKey> {
    const queryKey = options.queryKey!
    const queryHash = options.queryHash ?? hashQueryKeyByOptions(queryKey, options)
    let query = this.get<TQueryFnData, TError, TData, TQueryKey>(queryHash)

    if (!query) {
      query = new Query({
        cache: this,
        queryKey,
        queryHash,
        options: client.defaultQueryOptions(options),
        state,
        defaultOptions: client.getQueryDefaults(queryKey),
      })
      this.add(query)
    }

    return query
  }

  add(query: Query<any, any, any, any>): void {
    if (!this.#queries.has(query.queryHash)) {
      this.#queries.set(query.queryHash, query)

      this.notify({
        type: 'added',
        query,
      })
    }
  }

  remove(query: Query<any, any, any, any>): void {
    const queryInMap = this.#queries.get(query.queryHash)

    if (queryInMap) {
      query.destroy()

      if (queryInMap === query) {
        this.#queries.delete(query.queryHash)
      }

      this.notify({ type: 'removed', query })
    }
  }

  clear(): void {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        this.remove(query)
      })
    })
  }

  get<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(
    queryHash: string
  ): Query<TQueryFnData, TError, TData, TQueryKey> | undefined {
    return this.#queries.get(queryHash) as Query<TQueryFnData, TError, TData, TQueryKey> | undefined
  }

  getAll(): Array<Query> {
    return [...this.#queries.values()]
  }

  find<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData>(
    filters: WithRequired<QueryFilters, 'queryKey'>
  ): Query<TQueryFnData, TError, TData> | undefined {
    const defaultedFilters = { exact: true, ...filters }

    return this.getAll().find((query) => matchQuery(defaultedFilters, query))
  }

  findAll(filters: QueryFilters = {}): Array<Query> {
    const queries = this.getAll()
    return Object.keys(filters).length > 0 ? queries.filter((query) => matchQuery(filters, query)) : queries
  }

  notify(event: QueryCacheNotifyEvent) {
    notifyManager.batch(() => {
      this.listeners.forEach((listener) => {
        listener(event)
      })
    })
  }

  onFocus(): void {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        query.onFocus()
      })
    })
  }

  onOnline(): void {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        query.onOnline()
      })
    })
  }
}
