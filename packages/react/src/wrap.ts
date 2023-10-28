import { type ComponentProps, type ComponentType, createElement } from 'react'
import type { PropsWithoutChildren } from './types'
import type { AsyncBoundaryProps, DelayProps, ErrorBoundaryGroupProps, ErrorBoundaryProps, SuspenseProps } from '.'

/**
 * @experimental This is experimental feature.
 */
export const wrap =
  <
    TWrapperProps extends SuspenseProps | ErrorBoundaryProps | ErrorBoundaryGroupProps | DelayProps | AsyncBoundaryProps
  >(
    wrapper: ComponentType<TWrapperProps>,
    wrapperProps: PropsWithoutChildren<TWrapperProps>
  ) =>
  <TProps extends ComponentProps<ComponentType>>(component: ComponentType<TProps>) => {
    const wrapped = (props: TProps) =>
      createElement(wrapper, wrapperProps as TWrapperProps, createElement(component, props))
    if (process.env.NODE_ENV !== 'production') {
      const name = component.displayName || component.name || 'Component'
      wrapped.displayName = `with${wrapper.displayName}(${name})`
    }
    return wrapped
  }
