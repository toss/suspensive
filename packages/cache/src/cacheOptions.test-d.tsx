import { expectTypeOf } from 'vitest'
import { Cache } from './Cache'
import { cacheOptions } from './cacheOptions'
import type { ResolvedCached } from './CacheStore'
import { dataTagSymbol } from './types'
import { useCache } from './useCache'

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
          expectTypeOf(cached).toEqualTypeOf<ResolvedCached<number>['state']>()
          expectTypeOf(cached.data).toEqualTypeOf<number>()
          return <></>
        }}
      </Cache>
    ))()
  })

  it('should be used with useCache', () => {
    const cached = useCache(cache())
    expectTypeOf(cached).toEqualTypeOf<ResolvedCached<number>['state']>()
    expectTypeOf(cached.data).toEqualTypeOf<number>()
  })

  it('should add DataTag on cacheKey with ReturnType<typeof cacheFn>', () => {
    expectTypeOf(cache().cacheKey[dataTagSymbol]).toEqualTypeOf<number>()
  })
})
