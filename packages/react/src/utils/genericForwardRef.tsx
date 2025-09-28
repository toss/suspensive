import React from 'react';

/**
 * A utility that allows creating a forwardRef component that can accept generic props.
 * React.forwardRef does not support this out of the box.
 */
export function genericForwardRef<TRef, TProp = {}>(
  render: (props: TProp, ref: React.Ref<TRef>) => React.ReactElement | null
): (props: TProp & React.RefAttributes<TRef>) => React.ReactElement | null {
  return React.forwardRef(render as any) as any
}