import { Callout as FumadocsCallout } from 'fumadocs-ui/components/callout'
import type { ComponentPropsWithoutRef } from 'react'

type CalloutProps = Omit<
  ComponentPropsWithoutRef<typeof FumadocsCallout>,
  'type'
> & {
  type:
    | 'deprecated'
    | 'experimental'
    | ComponentPropsWithoutRef<typeof FumadocsCallout>['type']
}

export const Callout = ({ type, ...props }: CalloutProps) => {
  const definedType =
    type === 'deprecated' ? 'error' : type === 'experimental' ? 'warning' : type

  return <FumadocsCallout {...props} type={definedType} />
}
