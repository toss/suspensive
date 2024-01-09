import { describe, expect, expectTypeOf, it } from 'vitest'
import { assert } from './assert'

function get(type: 'foo' | 'bar') {
  switch (type) {
    case 'foo':
      return {
        foo1: 'foo1',
        foo2: 'foo2',
      } as const
    case 'bar':
      return {
        bar1: 'bar1',
        bar2: 'bar2',
      } as const
    default: {
      throw new Error('no type')
    }
  }
}

describe('assert', () => {
  // eslint-disable-next-line vitest/expect-expect
  it('should assert condition', () => {
    const data = get('foo')
    assert(data.foo1 === 'foo1', 'dummy-message')
    expectTypeOf(data.foo2).toMatchTypeOf<string>()
    expectTypeOf(data.bar1).not.toMatchTypeOf<string>()
  })

  it('should throw error if given condition is not met', () => {
    const assertMessage = "value should be 'paz'"
    const value = 'baz' as string
    expect(() => assert(value === 'paz', assertMessage)).toThrow(assertMessage)
  })
})
