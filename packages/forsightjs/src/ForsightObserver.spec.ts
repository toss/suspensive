import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ForsightObserver, createForsightObserver } from './ForsightObserver'

// Mock IntersectionObserver
const mockObserve = vi.fn()
const mockUnobserve = vi.fn()
const mockDisconnect = vi.fn()

const MockIntersectionObserver = vi.fn().mockImplementation((callback, options) => ({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect,
  thresholds: options?.threshold ? (Array.isArray(options.threshold) ? options.threshold : [options.threshold]) : [0],
}))

// Setup global mocks
Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
})

Object.defineProperty(globalThis, 'window', {
  writable: true,
  configurable: true,
  value: {
    ...globalThis.window,
    innerHeight: 1024,
    scrollY: 0,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  },
})

describe('ForsightObserver', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(globalThis.window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('createForsightObserver', () => {
    it('should create a ForsightObserver instance', () => {
      const observer = createForsightObserver()
      expect(observer).toBeInstanceOf(ForsightObserver)
    })

    it('should create observer with custom options', () => {
      const options = {
        predictDistance: 1000,
        velocityThreshold: 200,
        enablePrediction: false,
      }
      const observer = createForsightObserver(options)
      expect(observer).toBeInstanceOf(ForsightObserver)
    })
  })

  describe('ForsightObserver', () => {
    let observer: ForsightObserver
    let element: HTMLDivElement
    let callback: ReturnType<typeof vi.fn>

    beforeEach(() => {
      observer = new ForsightObserver()
      element = document.createElement('div')
      callback = vi.fn()
    })

    afterEach(() => {
      observer.disconnect()
    })

    it('should create IntersectionObserver with correct options', () => {
      expect(MockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        {
          root: null,
          rootMargin: '0px',
          threshold: 0,
        }
      )
    })

    it('should observe elements', () => {
      observer.observe(element, callback)
      expect(mockObserve).toHaveBeenCalledWith(element)
    })

    it('should unobserve elements', () => {
      observer.observe(element, callback)
      observer.unobserve(element)
      expect(mockUnobserve).toHaveBeenCalledWith(element)
    })

    it('should disconnect observer', () => {
      observer.disconnect()
      expect(mockDisconnect).toHaveBeenCalled()
    })

    it('should handle intersection events', () => {
      observer.observe(element, callback)

      // Mock getBoundingClientRect
      element.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 100,
        bottom: 200,
        left: 0,
        right: 100,
        width: 100,
        height: 100,
      })

      // Simulate intersection observer callback
      const intersectionCallback = MockIntersectionObserver.mock.calls[0][0]
      const mockEntry = {
        target: element,
        isIntersecting: true,
        intersectionRatio: 1,
        boundingClientRect: element.getBoundingClientRect(),
        intersectionRect: element.getBoundingClientRect(),
        rootBounds: { top: 0, bottom: 1024, left: 0, right: 1024, width: 1024, height: 1024 },
        time: Date.now(),
      }

      intersectionCallback([mockEntry])

      expect(callback).toHaveBeenCalledWith({
        element,
        isInView: true,
        predictedTimeToView: undefined,
        scrollVelocity: 0,
        entry: mockEntry,
      })
    })

    it('should create observer with custom rootMargin', () => {
      const customObserver = new ForsightObserver({
        rootMargin: '10px',
        threshold: 0.5,
      })

      expect(MockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        {
          root: null,
          rootMargin: '10px',
          threshold: 0.5,
        }
      )

      customObserver.disconnect()
    })
  })
})