import { FunctionComponent, useEffect, useMemo } from 'react'
import { useRerender } from '../hooks'
import { Tuple } from '../types'
import { suspensiveCache } from './suspensiveCache'

type Awaited<TData = unknown> = { data: TData; reset: () => void }
type AwaitOptions<TData, TKey extends Tuple> = {
  key: TKey
  fn: (options: { key: TKey }) => Promise<TData>
}

/**
 * @experimental This is experimental feature.
 */
export const awaitOptions = <TData, TKey extends Tuple>(options: AwaitOptions<TData, TKey>) => options

/**
 * @experimental This is experimental feature.
 */
export const useAwait = <TData, TKey extends Tuple>(options: AwaitOptions<TData, TKey>): Awaited<TData> => {
  const data = suspensiveCache.suspend(options.key, () => options.fn({ key: options.key }))

  const rerender = useRerender()
  const stringifiedKey = JSON.stringify(options.key)

  useEffect(() => {
    const attached = suspensiveCache.attach(options.key, rerender)
    return attached.detach
  }, [stringifiedKey, rerender])

  return useMemo(
    () => ({
      data,
      reset: () => suspensiveCache.reset(options.key),
    }),
    [stringifiedKey, data]
  )
}

type AwaitProps<TData, TKey extends Tuple> = {
  options: AwaitOptions<TData, TKey>
  children: FunctionComponent<Awaited<TData>>
}

/**
 * @experimental This is experimental feature.
 */
export const Await = <TData, TKey extends Tuple>({ children: Children, options }: AwaitProps<TData, TKey>) => {
  const awaited = useAwait<TData, TKey>(options)
  return <Children {...awaited} />
}
