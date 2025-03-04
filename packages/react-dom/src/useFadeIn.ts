import { type CSSProperties, useMemo } from 'react'
import { type InViewOptions, useInView } from './useInView'
import type { OmitKeyof } from './utility-types'

/**
 * @experimental This is experimental feature.
 */
export type FadeInOptions = OmitKeyof<
  InViewOptions,
  'fallbackInView' | 'initialInView' | 'skip' | 'onChange' | 'trackVisibility'
> & {
  /**
   * The duration in milliseconds of the animation.
   * @default 200
   */
  duration?: number
  /**
   * The timing function of the animation.
   * @default 'linear'
   */
  timingFunction?: CSSProperties['transitionTimingFunction']
}
type FadeInResult = Pick<ReturnType<typeof useInView>, 'ref'> & {
  style: {
    opacity: 0 | 1
    willChange: 'opacity'
    transition: `opacity ${number}ms ${Required<CSSProperties>['transitionTimingFunction']}`
  }
}
/**
 * @experimental This is experimental feature.
 */
export function useFadeIn({
  duration = 200,
  timingFunction = 'linear',
  delay,
  root,
  rootMargin,
  threshold,
  triggerOnce,
}: FadeInOptions): FadeInResult {
  const { inView, ref } = useInView({ delay, root, rootMargin, threshold, triggerOnce })
  return useMemo<FadeInResult>(
    () => ({
      ref,
      style: {
        opacity: inView ? 1 : 0,
        willChange: 'opacity',
        transition: `opacity ${duration}ms ${timingFunction}` as const,
      },
    }),
    [inView, duration, timingFunction, ref]
  )
}
