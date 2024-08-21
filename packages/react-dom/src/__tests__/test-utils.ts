import { act } from 'react'

declare global {
  /* eslint-disable-next-line no-var */
  var IS_REACT_ACT_ENVIRONMENT: boolean
  /* eslint-disable-next-line no-var */
  var jest: { fn: typeof vi.fn } | undefined
}

type Item = {
  callback: IntersectionObserverCallback
  elements: Set<Element>
  created: number
}

const observers = new Map<IntersectionObserver, Item>()

const isMocking = false

function warnOnMissingSetup() {
  if (isMocking) return
  console.error(
    `React Intersection Observer was not configured to handle mocking.
Outside Jest and Vitest, you might need to manually configure it by calling setupIntersectionMocking() and resetIntersectionMocking() in your test setup file.

// test-setup.js
import { resetIntersectionMocking, setupIntersectionMocking } from 'react-intersection-observer/test-utils';

beforeEach(() => {
  setupIntersectionMocking(vi.fn);
});

afterEach(() => {
  resetIntersectionMocking();
});`
  )
}

function triggerIntersection(
  elements: Element[],
  trigger: boolean | number,
  observer: IntersectionObserver,
  item: Item
) {
  const entries: IntersectionObserverEntry[] = []

  const isIntersecting =
    typeof trigger === 'number' ? observer.thresholds.some((threshold) => trigger >= threshold) : trigger

  let ratio: number

  if (typeof trigger === 'number') {
    const intersectedThresholds = observer.thresholds.filter((threshold) => trigger >= threshold)
    ratio = intersectedThresholds.length > 0 ? intersectedThresholds[intersectedThresholds.length - 1] : 0
  } else {
    ratio = trigger ? 1 : 0
  }

  for (const element of elements) {
    entries.push(<IntersectionObserverEntry>{
      boundingClientRect: element.getBoundingClientRect(),
      intersectionRatio: ratio,
      intersectionRect: isIntersecting
        ? element.getBoundingClientRect()
        : {
            bottom: 0,
            height: 0,
            left: 0,
            right: 0,
            top: 0,
            width: 0,
            x: 0,
            y: 0,
            toJSON() {},
          },
      isIntersecting,
      rootBounds: observer.root instanceof Element ? observer.root?.getBoundingClientRect() : null,
      target: element,
      time: Date.now() - item.created,
    })
  }

  // Trigger the IntersectionObserver callback with all the entries
  if (act && global.IS_REACT_ACT_ENVIRONMENT) act(() => item.callback(entries, observer))
  else item.callback(entries, observer)
}
/**
 * Set the `isIntersecting` on all current IntersectionObserver instances
 * @param isIntersecting {boolean | number}
 */
export function mockAllIsIntersecting(isIntersecting: boolean | number) {
  warnOnMissingSetup()
  for (const [observer, item] of observers) {
    triggerIntersection(Array.from(item.elements), isIntersecting, observer, item)
  }
}

/**
 * Set the `isIntersecting` for the IntersectionObserver of a specific element.
 * @param element {Element}
 * @param isIntersecting {boolean | number}
 */
export function mockIsIntersecting(element: Element, isIntersecting: boolean | number) {
  warnOnMissingSetup()
  const observer = intersectionMockInstance(element)
  if (!observer) {
    throw new Error('No IntersectionObserver instance found for element. Is it still mounted in the DOM?')
  }
  const item = observers.get(observer)
  if (item) {
    triggerIntersection([element], isIntersecting, observer, item)
  }
}

/**
 * Call the `intersectionMockInstance` method with an element, to get the (mocked)
 * `IntersectionObserver` instance. You can use this to spy on the `observe` and
 * `unobserve` methods.
 * @param element {Element}
 * @returns IntersectionObserver
 */
export function intersectionMockInstance(element: Element): IntersectionObserver {
  warnOnMissingSetup()
  for (const [observer, item] of observers) {
    if (item.elements.has(element)) {
      return observer
    }
  }

  throw new Error('Failed to find IntersectionObserver for element. Is it being observed?')
}

export type Mutable<TObject> = {
  -readonly [TKey in keyof TObject]: TObject[TKey]
}
