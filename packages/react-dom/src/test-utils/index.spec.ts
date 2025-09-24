import { describe, expect, it, vi } from 'vitest'
import { intersectionMockInstance, mockIsIntersecting, mockAllIsIntersecting } from './index'

// Mock console.error to avoid pollution during tests
const originalConsoleError = console.error

describe('test-utils', () => {
  beforeEach(() => {
    console.error = vi.fn()
  })

  afterEach(() => {
    console.error = originalConsoleError
  })

  describe('intersectionMockInstance error cases', () => {
    it('should throw error when no observer found for element', () => {
      const element = document.createElement('div')

      expect(() => {
        intersectionMockInstance(element)
      }).toThrow('Failed to find IntersectionObserver for element. Is it being observed?')
    })
  })

  describe('mockIsIntersecting error cases', () => {
    it('should throw error when no observer found for element', () => {
      const element = document.createElement('div')

      expect(() => {
        mockIsIntersecting(element, true)
      }).toThrow('Failed to find IntersectionObserver for element. Is it being observed?')
    })
  })

  describe('mockAllIsIntersecting', () => {
    it('should handle empty observers list', () => {
      // This should not throw, just handle empty list gracefully
      expect(() => {
        mockAllIsIntersecting(true)
      }).not.toThrow()
    })
  })
})
