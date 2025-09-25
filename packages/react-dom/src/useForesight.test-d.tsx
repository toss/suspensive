import { expectType } from 'vitest'
import { useForesight, type UseForesightOptions, type UseForesightResult } from './useForesight'

describe('useForesight types', () => {
  it('should have correct types for options', () => {
    const options: UseForesightOptions = {
      callback: () => {},
      name: 'test',
      hitSlop: 10,
      meta: { key: 'value' },
      reactivateAfter: 1000,
      autoInitialize: true,
      disabled: false,
    }

    expectType<UseForesightOptions>(options)
  })

  it('should have correct return types', () => {
    const result = useForesight({
      callback: () => {},
      name: 'test',
    })

    expectType<UseForesightResult>(result)
    expectType<(element: Element | null) => void>(result.ref)
    expectType<boolean>(result.isRegistered)
  })

  it('should work with minimal options', () => {
    const result = useForesight({
      callback: () => {},
    })

    expectType<UseForesightResult>(result)
  })
})
