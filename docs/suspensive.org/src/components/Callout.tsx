import { Callout as NextraCallout } from 'nextra/components'
import type { ComponentPropsWithoutRef } from 'react'

type CalloutProps = Omit<
  ComponentPropsWithoutRef<typeof NextraCallout>,
  'type'
> & {
  type:
    | 'deprecated'
    | 'experimental'
    | ComponentPropsWithoutRef<typeof NextraCallout>['type']
}

export const Callout = ({ type, ...props }: CalloutProps) => {
  const definedType =
    type === 'deprecated' ? 'error' : type === 'experimental' ? 'warning' : type

  return <NextraCallout {...props} type={definedType} />
}
