import { expectTypeOf } from 'vitest'
import { Cache } from './Cache'
import { cacheOptions } from './cacheOptions'
import { dataTagSymbol } from './types'
import { useCache } from './useCache'

interface ResolvedCachedState<TData> {
  promise: Promise<TData>
  data: TData
  error: undefined
}

const key = (id: number) => ['key', id] as const

const cache = () =>
  cacheOptions({
    cacheKey: key(1),
    cacheFn: () => Promise.resolve(5),
  })

describe('cacheOptions', () => {
  it('should be used with <Cache />', () => {
    ;(() => (
      <Cache {...cache()}>
        {(cached) => {
          expectTypeOf(cached).toEqualTypeOf<ResolvedCachedState<number>>()
          expectTypeOf(cached.data).toEqualTypeOf<number>()
          return <></>
        }}
      </Cache>
    ))()
  })

  it('should be used with useCache', () => {
    const cached = useCache(cache())
    expectTypeOf(cached).toEqualTypeOf<ResolvedCachedState<number>>()
    expectTypeOf(cached.data).toEqualTypeOf<number>()
  })

  it('should tag the cacheKey with the result type of the cacheFn', () => {
    expect(() => {
      const { cacheKey } = cache()
      expectTypeOf(cacheKey[dataTagSymbol]).toEqualTypeOf<number>()
    })
  })
})
