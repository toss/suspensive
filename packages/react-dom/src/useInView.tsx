import { useCallback, useEffect, useRef, useState } from 'react'
import { observe } from './utils/observe'

export interface InViewOptions extends IntersectionObserverInit {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
  triggerOnce?: boolean
  skip?: boolean
  initialIsInView?: boolean
  fallbackIsInView?: boolean
  trackVisibility?: boolean
  delay?: number
  onChange?: (param: { isInView: boolean; entry: IntersectionObserverEntry }) => void
  onInView?: (entry: IntersectionObserverEntry) => void
  onInViewEnd?: (entry: IntersectionObserverEntry) => void
}
export function useInView({
  threshold,
  delay,
  trackVisibility,
  rootMargin,
  root,
  triggerOnce,
  skip,
  initialIsInView,
  fallbackIsInView,
  onChange,
  onInView,
  onInViewEnd,
}: InViewOptions = {}): {
  ref: (node?: Element | null) => void
  isInView: boolean
  entry?: IntersectionObserverEntry
} {
  const hasBeenInViewRef = useRef(initialIsInView ?? false)
  const [elementRef, setElementRef] = useState<Element | null>(null)
  const onChangeRef = useRef<InViewOptions['onChange']>(null)
  const [state, setState] = useState<{ isInView: boolean; entry?: IntersectionObserverEntry }>({
    isInView: initialIsInView ?? false,
    entry: undefined,
  })
  onChangeRef.current = ({ isInView, entry }: { isInView: boolean; entry: IntersectionObserverEntry }) => {
    onChange?.({ isInView, entry })
    if (isInView) {
      hasBeenInViewRef.current = true
      onInView?.(entry)
    } else if (hasBeenInViewRef.current) {
      onInViewEnd?.(entry)
    }
  }

  useEffect(() => {
    if (skip || !elementRef) return
    let unobserve: (() => void) | undefined
    unobserve = observe(
      elementRef,
      (isInView, entry) => {
        setState({ isInView, entry })
        onChangeRef.current?.({ isInView, entry })

        if (entry.isIntersecting && triggerOnce && unobserve) {
          unobserve()
          unobserve = undefined
        }
      },
      { root, rootMargin, threshold, trackVisibility, delay },
      fallbackIsInView
    )
    return unobserve
  }, [
    Array.isArray(threshold) ? threshold.toString() : threshold,
    elementRef,
    root,
    rootMargin,
    triggerOnce,
    skip,
    trackVisibility,
    fallbackIsInView,
    delay,
  ])
  const entryTarget = state.entry?.target
  const previousEntryTarget = useRef<Element>(null)
  if (!elementRef && entryTarget && !triggerOnce && !skip && previousEntryTarget.current !== entryTarget) {
    previousEntryTarget.current = entryTarget
    setState({ isInView: initialIsInView ?? false, entry: undefined })
  }
  return Object.assign(state, { ref: useCallback((node?: Element | null) => setElementRef(node ?? null), []) })
}
