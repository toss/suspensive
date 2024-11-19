import { type CSSProperties, type ComponentPropsWithoutRef, type ElementType } from 'react'
import { useInView } from './useInView'

type FadeInBaseProps = {
  delay?: number
  duration?: number
  timingFunction?: CSSProperties['animationTimingFunction']
}
type FadeInProps<TAs extends ElementType> = {
  as?: TAs
} & Omit<ComponentPropsWithoutRef<TAs>, 'as' | keyof FadInBaseProps> &
  FadeInBaseProps

export function FadeIn<TAs extends ElementType = 'div'>({
  as,
  delay = 0,
  duration = 200,
  timingFunction = 'linear',
  ...rest
}: FadeInProps<TAs>) {
  const Component = as || 'div'
  const { inView, ref } = useInView()
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
