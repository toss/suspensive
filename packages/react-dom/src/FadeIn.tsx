import { type CSSProperties, type ComponentPropsWithoutRef, type ElementType } from 'react'
import { InView } from './InView'
import { type InViewOptions } from './useInView'
import type { OmitKeyof } from './utility-types'

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
  /**
   * The style of the element.
   */
  style?: OmitKeyof<CSSProperties, 'opacity' | 'willChange' | 'transition'>
  /**
   * The options for the `useInView` hook.
   */
  inViewOptions?: InViewOptions
}

/**
 * A component that fades in when it comes into view.
 */
export function FadeIn<TAs extends ElementType = 'div'>({
  as,
  delay = 0,
  duration = 200,
  timingFunction = 'linear',
  inViewOptions,
  ...restProps
}: FadeInProps<TAs>) {
  const Component = as ?? 'div'
  return (
    <InView {...inViewOptions}>
      {({ inView, ref }) => (
        <Component
          {...restProps}
          ref={ref}
          style={{
            ...restProps.style,
            opacity: inView ? 1 : 0,
            willChange: 'opacity',
            transition: `opacity ${duration}ms ${timingFunction} ${delay}ms`,
          }}
        />
      )}
    </InView>
  )
}
