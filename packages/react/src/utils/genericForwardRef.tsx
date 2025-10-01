import { type PropsWithoutRef, type ReactElement, type Ref, type RefAttributes, forwardRef } from 'react'

/**
 * A utility that allows creating a forwardRef component that can accept generic props.
 * React.forwardRef does not support this out of the box.
 */
export function genericForwardRef<TRef, TProp = object>(
  render: (props: PropsWithoutRef<TProp>, ref: Ref<TRef>) => ReactElement | null
) {
  return forwardRef(render) as (props: TProp & RefAttributes<TRef>) => ReactElement | null
}
