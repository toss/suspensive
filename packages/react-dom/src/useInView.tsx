import { useEffect, useRef, useState } from 'react'
import { observe } from './utils/observe'

export interface InViewOptions extends IntersectionObserverInit {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
  triggerOnce?: boolean
  skip?: boolean
  initialInView?: boolean
  fallbackInView?: boolean
  trackVisibility?: boolean
  delay?: number
  onChange?: (inView: boolean, entry: IntersectionObserverEntry) => void
}

export type InViewResult = {
  ref: (node?: Element | null) => void
  inView: boolean
  entry?: IntersectionObserverEntry
}

export function useInView({
  threshold,
  delay,
  trackVisibility,
  rootMargin,
  root,
  triggerOnce,
  skip,
  initialInView,
  fallbackInView,
  onChange,
}: InViewOptions = {}): InViewResult {
  const [ref, setRef] = useState<Element | null>(null)
  const callback = useRef<InViewOptions['onChange']>()
  const [state, setState] = useState<{ inView: boolean; entry?: IntersectionObserverEntry }>({
    inView: initialInView ?? false,
    entry: undefined,
  })

  // Store the onChange callback in a `ref`, so we can access the latest instance
  // inside the `useEffect`, but without triggering a rerender.
  callback.current = onChange

  useEffect(
    () => {
      // Ensure we have node ref, and that we shouldn't skip observing
      if (skip || !ref) return

      let unobserve: (() => void) | undefined
      unobserve = observe(
        ref,
        (inView, entry) => {
          setState({
            inView,
            entry,
          })
          if (callback.current) callback.current(inView, entry)

          if (entry.isIntersecting && triggerOnce && unobserve) {
            // If it should only trigger once, unobserve the element after it's inView
            unobserve()
            unobserve = undefined
          }
        },
        {
          root,
          rootMargin,
          threshold,
          trackVisibility,
          delay,
        },
        fallbackInView
      )

      return () => {
        if (unobserve) {
          unobserve()
        }
      }
    },
    // We break the rule here, because we aren't including the actual `threshold` variable
    [
      // If the threshold is an array, convert it to a string, so it won't change between renders.
      Array.isArray(threshold) ? threshold.toString() : threshold,
      ref,
      root,
      rootMargin,
      triggerOnce,
      skip,
      trackVisibility,
      fallbackInView,
      delay,
    ]
  )

  const entryTarget = state.entry?.target
  const previousEntryTarget = useRef<Element>()
  if (!ref && entryTarget && !triggerOnce && !skip && previousEntryTarget.current !== entryTarget) {
    // If we don't have a node ref, then reset the state (unless the hook is set to only `triggerOnce` or `skip`)
    // This ensures we correctly reflect the current state - If you aren't observing anything, then nothing is inView
    previousEntryTarget.current = entryTarget
    setState({
      inView: !!initialInView,
      entry: undefined,
    })
  }

  return { ref: setRef as InViewResult['ref'], ...state }
}
