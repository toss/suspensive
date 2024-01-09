import { Callout as NextraCallout } from 'nextra/components'
import type { ComponentProps } from 'react'

interface CalloutProps extends Omit<ComponentProps<typeof NextraCallout>, 'type'> {
  type: 'deprecated' | 'experimental' | ComponentProps<typeof NextraCallout>['type']
}

export const Callout = ({ type, ...props }: CalloutProps) => {
  const definedType = type === 'deprecated' ? 'error' : type === 'experimental' ? 'warning' : type

  return <NextraCallout {...props} type={definedType} />
}
