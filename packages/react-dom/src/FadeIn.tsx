import { type CSSProperties, type ComponentPropsWithoutRef, type ElementType } from 'react'
import { InView } from './InView'
import { type InViewOptions } from './useInView'
import { type OmitKeyof, type Override } from './utility-types'

type FadeInProps<TAs extends ElementType> = Override<
  Override<
    ComponentPropsWithoutRef<TAs>,
    OmitKeyof<InViewOptions, 'fallbackInView' | 'initialInView' | 'skip' | 'onChange' | 'trackVisibility'>
  >,
  {
    /**
     * The element type to render.
     * @default 'div'
     */
    as?: TAs
    /**
     * The style of the element.
     */
    style?: OmitKeyof<CSSProperties, 'opacity' | 'willChange' | 'transition'>
    /**
     * The duration in milliseconds of the animation.
     * @default 200
     */
    duration?: number
    /**
     * The timing function of the animation.
     * @default 'linear'
     */
    timingFunction?: CSSProperties['animationTimingFunction']
  }
>

/**
 * A component that fades in when it comes into view.
 */
export function FadeIn<TAs extends ElementType = 'div'>({
  as,
  style,
  // fadeIn Options
  duration = 200,
  timingFunction = 'linear',
  // inView options
  delay,
  rootMargin,
  threshold,
  triggerOnce,
  ...restProps
}: FadeInProps<TAs>) {
  const Component = as ?? 'div'
  return (
    <InView rootMargin={rootMargin} delay={delay} threshold={threshold} triggerOnce={triggerOnce}>
      {({ inView, ref }) => (
        <Component
          {...restProps}
          ref={ref}
          style={{
            ...style,
            opacity: inView ? 1 : 0,
            willChange: 'opacity',
            transition: `opacity ${duration}ms ${timingFunction}`,
          }}
        />
      )}
    </InView>
  )
}
