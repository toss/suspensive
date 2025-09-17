export interface PredictiveViewportOptions extends IntersectionObserverInit {
  /** Distance ahead to predict (in pixels) */
  predictDistance?: number
  /** Velocity threshold for prediction (pixels per second) */
  velocityThreshold?: number
  /** Time window for velocity calculation (ms) */
  velocityWindow?: number
  /** Enable predictive loading */
  enablePrediction?: boolean
}

export interface ViewportEvent {
  /** Element that triggered the event */
  element: Element
  /** Whether element is currently in view */
  isInView: boolean
  /** Predicted time until element enters view (ms) */
  predictedTimeToView?: number
  /** Current scroll velocity (pixels per second) */
  scrollVelocity?: number
  /** Original intersection observer entry */
  entry: IntersectionObserverEntry
}

export type ViewportCallback = (event: ViewportEvent) => void

interface ScrollState {
  position: number
  timestamp: number
}

/**
 * Enhanced viewport detection with predictive capabilities
 * Provides foresight into when elements will enter the viewport based on scroll velocity
 */
export class ForsightObserver {
  private observer: IntersectionObserver
  private callbacks = new Map<Element, ViewportCallback>()
  private scrollHistory: ScrollState[] = []
  private lastScrollPosition = 0
  private options: Required<PredictiveViewportOptions>

  constructor(options: PredictiveViewportOptions = {}) {
    this.options = {
      root: null,
      rootMargin: '0px',
      threshold: 0,
      predictDistance: 500,
      velocityThreshold: 100,
      velocityWindow: 150,
      enablePrediction: true,
      ...options,
    }

    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
      root: this.options.root,
      rootMargin: this.options.rootMargin,
      threshold: this.options.threshold,
    })

    if (this.options.enablePrediction) {
      this.setupScrollTracking()
    }
  }

  private setupScrollTracking(): void {
    if (typeof window === 'undefined') return

    const trackScroll = () => {
      const now = Date.now()
      const position = window.scrollY
      
      this.scrollHistory.push({ position, timestamp: now })
      
      // Keep only recent history for velocity calculation
      const cutoffTime = now - this.options.velocityWindow
      this.scrollHistory = this.scrollHistory.filter(state => state.timestamp > cutoffTime)
      
      this.lastScrollPosition = position
    }

    // Use passive listener for better performance
    window.addEventListener('scroll', trackScroll, { passive: true })
  }

  private calculateScrollVelocity(): number {
    if (this.scrollHistory.length < 2) return 0

    const recent = this.scrollHistory[this.scrollHistory.length - 1]
    const older = this.scrollHistory[0]
    
    const distance = recent.position - older.position
    const time = (recent.timestamp - older.timestamp) / 1000 // Convert to seconds
    
    return time > 0 ? distance / time : 0
  }

  private predictTimeToView(element: Element, velocity: number): number | undefined {
    if (!this.options.enablePrediction || Math.abs(velocity) < this.options.velocityThreshold) {
      return undefined
    }

    const rect = element.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    
    // Calculate distance to viewport
    let distanceToView: number
    
    if (rect.top > viewportHeight) {
      // Element is below viewport
      distanceToView = rect.top - viewportHeight
    } else if (rect.bottom < 0) {
      // Element is above viewport
      distanceToView = Math.abs(rect.bottom)
    } else {
      // Element is in viewport
      return 0
    }

    // Add prediction distance for earlier notification
    distanceToView += this.options.predictDistance

    // Calculate time based on current velocity
    return velocity !== 0 ? (distanceToView / Math.abs(velocity)) * 1000 : undefined
  }

  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    const velocity = this.calculateScrollVelocity()

    entries.forEach((entry) => {
      const callback = this.callbacks.get(entry.target)
      if (!callback) return

      const predictedTimeToView = this.predictTimeToView(entry.target, velocity)

      const event: ViewportEvent = {
        element: entry.target,
        isInView: entry.isIntersecting,
        predictedTimeToView,
        scrollVelocity: velocity,
        entry,
      }

      callback(event)
    })
  }

  /**
   * Start observing an element
   */
  observe(element: Element, callback: ViewportCallback): void {
    this.callbacks.set(element, callback)
    this.observer.observe(element)
  }

  /**
   * Stop observing an element
   */
  unobserve(element: Element): void {
    this.callbacks.delete(element)
    this.observer.unobserve(element)
  }

  /**
   * Stop observing all elements and cleanup
   */
  disconnect(): void {
    this.callbacks.clear()
    this.observer.disconnect()
  }
}

/**
 * Create a new ForsightObserver instance
 */
export function createForsightObserver(options?: PredictiveViewportOptions): ForsightObserver {
  return new ForsightObserver(options)
}