import { type CSSProperties, useMemo } from 'react'
import { type InViewOptions, useInView } from './useInView'
import type { OmitKeyof } from './utility-types/OmitKeyof'

/**
 * @experimental This is experimental feature.
 */
export type FadeInOptions = OmitKeyof<
  InViewOptions,
  'fallbackIsInView' | 'initialIsInView' | 'skip' | 'onChange' | 'trackVisibility'
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
  const { isInView, ref } = useInView({ delay, root, rootMargin, threshold, triggerOnce })
  return useMemo<FadeInResult>(
    () => ({
      ref,
      style: {
        opacity: isInView ? 1 : 0,
        willChange: 'opacity',
        transition: `opacity ${duration}ms ${timingFunction}` as const,
      },
    }),
    [isInView, duration, timingFunction, ref]
  )
}
