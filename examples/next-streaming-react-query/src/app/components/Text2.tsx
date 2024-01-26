import { type ComponentProps, forwardRef } from 'react'

export const Text2 = forwardRef<HTMLParagraphElement, ComponentProps<'p'>>((props, ref) => (
  <p ref={ref}>result: {props.children}</p>
))
Text2.displayName = 'Text2'
