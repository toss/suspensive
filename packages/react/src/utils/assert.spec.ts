import { assert } from '.'

function get(type: 'Helper' | 'Core') {
  switch (type) {
    case 'Helper':
      return {
        type: 'Helper',
        library: 'Suspensive',
      } as const
    case 'Core':
      return {
        type: 'Core',
        library: 'React',
      } as const
    default: {
      throw new Error('no type')
    }
  }
}

describe('assert', () => {
  it('should assert condition', () => {
    const data = get('Helper')
    assert(data.type === 'Helper', "data.type should be 'Helper'")
    expect(data.library).toBe('Suspensive')
  })

  it('should throw error if given condition is not met', () => {
    const value = 'Suspensive' as string
    expect(() => assert(value === 'React', "value should be 'React'")).toThrow("value should be 'React'")
  })
})
