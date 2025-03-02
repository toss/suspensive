import type { ComponentProps, ComponentType, ReactNode } from 'react'
import { useIsClient } from './hooks'
import type { PropsWithoutChildren } from './utility-types'

export interface ClientOnlyProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * This component ensures its children are only rendered on the client-side.
 * @see {@link https://suspensive.org/docs/react/ClientOnly Suspensive Docs}
 */
export const ClientOnly = Object.assign(
  ({ children, fallback }: ClientOnlyProps) => <>{useIsClient() ? children : fallback}</>,
  {
    displayName: 'ClientOnly',
    wrap: <TProps extends ComponentProps<ComponentType> = Record<string, never>>(
      clientOnlyProps: PropsWithoutChildren<ClientOnlyProps> = { fallback: undefined },
      Component: ComponentType<TProps>
    ) =>
      Object.assign(
        (props: TProps) => (
          <ClientOnly {...clientOnlyProps}>
            <Component {...props} />
          </ClientOnly>
        ),
        { displayName: `ClientOnly.wrap(${Component.displayName || Component.name || 'Component'})` }
      ),
  }
)
