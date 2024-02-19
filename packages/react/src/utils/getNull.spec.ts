import { describe, expect, it } from 'vitest'
import { getNull } from './getNull'

describe('getNull', () => {
  it('should be return null', () => {
    expect(getNull()).toBeNull()
  })
})
