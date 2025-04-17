type ObserverInstanceCallback = (inView: boolean, entry: IntersectionObserverEntry) => void

const observerMap = new Map<
  string,
  { id: string; observer: IntersectionObserver; elements: Map<Element, Array<ObserverInstanceCallback>> }
>()

const RootIds: WeakMap<Element | Document, string> = new WeakMap()
let rootId = 0

function getRootId(root: IntersectionObserverInit['root']) {
  if (!root) return '0'
  if (RootIds.has(root)) return RootIds.get(root)
  rootId += 1
  RootIds.set(root, rootId.toString())
  return RootIds.get(root)
}

export const optionsToId = (options: IntersectionObserverInit & { trackVisibility?: boolean; delayMs?: number }) =>
  Object.keys(options)
    .sort()
    .filter((key) => options[key as keyof IntersectionObserverInit] !== undefined)
    .map(
      (key) =>
        `${key}_${
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          key === 'root' ? getRootId(options.root) : options[key as keyof IntersectionObserverInit]
        }`
    )
    .toString()

function createObserver(options: IntersectionObserverInit & { trackVisibility?: boolean; delayMs?: number }) {
  // Create a unique ID for this observer instance, based on the root, root margin and threshold.
  const id = optionsToId(options)
  let instance = observerMap.get(id)

  if (!instance) {
    // Create a map of elements this observer is going to observe. Each element has a list of callbacks that should be triggered, once it comes into view.
    const elements = new Map<Element, Array<ObserverInstanceCallback>>()
    let thresholds: number[] | readonly number[] = []

    const observer = new IntersectionObserver((entries: Array<IntersectionObserverEntry & { isVisible?: boolean }>) => {
      entries.forEach((entry) => {
        // While it would be nice if you could just look at isIntersecting to determine if the component is inside the viewport, browsers can't agree on how to use it.
        // -Firefox ignores `threshold` when considering `isIntersecting`, so it will never be false again if `threshold` is > 0
        const inView = entry.isIntersecting && thresholds.some((threshold) => entry.intersectionRatio >= threshold)

        if (options.trackVisibility && typeof entry.isVisible === 'undefined') {
          // The browser doesn't support Intersection Observer v2, falling back to v1 behavior.
          entry.isVisible = inView
        }

        elements.get(entry.target)?.forEach((callback) => {
          callback(inView, entry)
        })
      })
    }, options)

    // Ensure we have a valid thresholds array. If not, use the threshold from the options
    thresholds =
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      observer.thresholds || (Array.isArray(options.threshold) ? options.threshold : [options.threshold || 0])

    instance = {
      id,
      observer,
      elements,
    }

    observerMap.set(id, instance)
  }

  return instance
}

export function observe(
  element: Element,
  callback: ObserverInstanceCallback,
  options: IntersectionObserverInit & {
    trackVisibility?: boolean
    delayMs?: number
  } = {},
  fallbackInView?: boolean
) {
  if (typeof window.IntersectionObserver === 'undefined' && fallbackInView !== undefined) {
    const bounds = element.getBoundingClientRect()
    callback(fallbackInView, {
      isIntersecting: fallbackInView,
      target: element,
      intersectionRatio: typeof options.threshold === 'number' ? options.threshold : 0,
      time: 0,
      boundingClientRect: bounds,
      intersectionRect: bounds,
      rootBounds: bounds,
    })
    return () => {
      // Nothing to cleanup
    }
  }
  // An observer with the same options can be reused, so lets use this fact
  const { id, observer, elements } = createObserver(options)

  // Register the callback listener for this element
  const callbacks = elements.get(element) || []
  if (!elements.has(element)) {
    elements.set(element, callbacks)
  }

  callbacks.push(callback)
  observer.observe(element)

  return function unobserve() {
    // Remove the callback from the callback list
    callbacks.splice(callbacks.indexOf(callback), 1)

    if (callbacks.length === 0) {
      // No more callback exists for element, so destroy it
      elements.delete(element)
      observer.unobserve(element)
    }

    if (elements.size === 0) {
      // No more elements are being observer by this instance, so destroy it
      observer.disconnect()
      observerMap.delete(id)
    }
  }
}
