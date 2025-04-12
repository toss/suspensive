import { useCallback, useEffect, useRef, useState } from 'react'
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
}: InViewOptions = {}): {
  ref: (node?: Element | null) => void
  inView: boolean
  entry?: IntersectionObserverEntry
} {
  const [ref, setRef] = useState<Element | null>(null)
  const onChangeRef = useRef<InViewOptions['onChange']>(null)
  const [state, setState] = useState<{ inView: boolean; entry?: IntersectionObserverEntry }>({
    inView: initialInView ?? false,
    entry: undefined,
  })
  onChangeRef.current = onChange
  useEffect(() => {
    if (skip || !ref) return
    let unobserve: (() => void) | undefined
    unobserve = observe(
      ref,
      (inView, entry) => {
        setState({ inView, entry })
        onChangeRef.current?.(inView, entry)

        if (entry.isIntersecting && triggerOnce && unobserve) {
          unobserve()
          unobserve = undefined
        }
      },
      { root, rootMargin, threshold, trackVisibility, delay },
      fallbackInView
    )
    return unobserve
  }, [
    Array.isArray(threshold) ? threshold.toString() : threshold,
    ref,
    root,
    rootMargin,
    triggerOnce,
    skip,
    trackVisibility,
    fallbackInView,
    delay,
  ])
  const entryTarget = state.entry?.target
  const previousEntryTarget = useRef<Element>(null)
  if (!ref && entryTarget && !triggerOnce && !skip && previousEntryTarget.current !== entryTarget) {
    previousEntryTarget.current = entryTarget
    setState({ inView: initialInView ?? false, entry: undefined })
  }
  return Object.assign(state, { ref: useCallback((node?: Element | null) => setRef(node ?? null), []) })
}
