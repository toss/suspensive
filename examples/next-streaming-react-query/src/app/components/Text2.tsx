import { type ComponentProps } from 'react'

export const Text2 = ({ ref, ...props }: ComponentProps<'p'>) => (
  <p {...props} ref={ref}>
    result: {props.children}
  </p>
)
