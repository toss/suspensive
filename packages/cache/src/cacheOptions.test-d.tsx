import { expectTypeOf } from 'vitest'
import type { ResolvedCached } from './Cache'
import { cacheOptions } from './cacheOptions'
import { Read } from './Read'
import { dataTagSymbol } from './types'
import { useRead } from './useRead'

const key = (id: number) => ['key', id] as const

const successCache = () =>
  cacheOptions({
    cacheKey: key(1),
    cacheFn: () => Promise.resolve(5),
  })

describe('cacheOptions', () => {
  it('should be used with <Read />', () => {
    ;(() => (
      <Read {...successCache()}>
        {(cached) => {
          expectTypeOf(cached).toEqualTypeOf<ResolvedCached<number>['state']>()
          expectTypeOf(cached.data).toEqualTypeOf<number>()
          return <></>
        }}
      </Read>
    ))()
  })

  it('should be used with useRead', () => {
    const cached = useRead(successCache())
    expectTypeOf(cached).toEqualTypeOf<ResolvedCached<number>['state']>()
    expectTypeOf(cached.data).toEqualTypeOf<number>()
  })

  it('should add DataTag on cacheKey with ReturnType<typeof cacheFn>', () => {
    expectTypeOf(successCache().cacheKey[dataTagSymbol]).toEqualTypeOf<number>()
  })
})
