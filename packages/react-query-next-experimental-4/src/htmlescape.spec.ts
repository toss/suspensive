import { describe, expect, it } from 'vitest'
import { htmlEscapeJsonString } from './htmlescape'

describe('htmlEscapeJsonString', () => {
  it('should escape & to \\u0026', () => {
    expect(htmlEscapeJsonString('&')).toBe('\\u0026')
  })

  it('should escape > to \\u003e', () => {
    expect(htmlEscapeJsonString('>')).toBe('\\u003e')
  })

  it('should escape < to \\u003c', () => {
    expect(htmlEscapeJsonString('<')).toBe('\\u003c')
  })

  it('should escape \\u2028 to \\u2028', () => {
    expect(htmlEscapeJsonString('\u2028')).toBe('\\u2028')
  })

  it('should escape \\u2029 to \\u2029', () => {
    expect(htmlEscapeJsonString('\u2029')).toBe('\\u2029')
  })

  it('should escape multiple characters', () => {
    expect(htmlEscapeJsonString('&><\u2028\u2029')).toBe('\\u0026\\u003e\\u003c\\u2028\\u2029')
  })

  it('should not escape characters that do not need escaping', () => {
    expect(htmlEscapeJsonString('hello')).toBe('hello')
  })

  it('should handle empty string', () => {
    expect(htmlEscapeJsonString('')).toBe('')
  })
})
