import { type ReactNode } from 'react'
import { type FadeInOptions, useFadeIn } from './useFadeIn'

type FadeInProps = FadeInOptions & {
  children: (fadeInResult: ReturnType<typeof useFadeIn>) => ReactNode
}
/**
 * A component that fades in when it comes into view.
 */
export function FadeIn({
  duration = 200,
  timingFunction = 'linear',
  delay,
  root,
  rootMargin,
  threshold,
  triggerOnce,
  children,
}: FadeInProps) {
  const result = useFadeIn({ delay, duration, root, rootMargin, threshold, timingFunction, triggerOnce })
  return <>{children(result)}</>
}
