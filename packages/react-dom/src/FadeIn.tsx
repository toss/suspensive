import { type CSSProperties, type ComponentPropsWithoutRef, type ElementType } from 'react'
import { type InViewOptions, useInView } from './useInView'

type FadeInProps<TAs extends ElementType> = ComponentPropsWithoutRef<TAs> & {
  /**
   * The element type to render.
   */
  as?: TAs
  /**
   * The delay in milliseconds before the animation starts.
   */
  delay?: number
  /**
   * The duration in milliseconds of the animation.
   */
  duration?: number
  /**
   * The timing function of the animation.
   */
  timingFunction?: CSSProperties['animationTimingFunction']
  inViewOptions?: InViewOptions
}

export function FadeIn<TAs extends ElementType = 'div'>({
  as,
  delay = 0,
  duration = 200,
  timingFunction = 'linear',
  inViewOptions,
  ...rest
}: FadeInProps<TAs>) {
  const Component = as ?? 'div'
  const { inView, ref } = useInView(inViewOptions)
  return (
    <Component
      {...rest}
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        willChange: 'opacity',
        transition: `opacity ${duration}ms ${timingFunction} ${delay}ms`,
      }}
    />
  )
}
