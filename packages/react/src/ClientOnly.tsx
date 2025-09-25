import type { ComponentProps, ComponentType, ReactNode } from 'react'
import { useIsClient } from './useIsClient'
import type { PropsWithoutChildren } from './utility-types/PropsWithoutChildren'

export interface ClientOnlyProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * This component ensures its children are only rendered on the client-side.
 * @see {@link https://suspensive.org/docs/react/ClientOnly Suspensive Docs}
 * @see {@link https://suspensive.org/docs/react/useIsClient useIsClient} is used internally for environment detection
 */
export const ClientOnly = Object.assign(
  ({ children, fallback }: ClientOnlyProps) => <>{useIsClient() ? children : fallback}</>,
  {
    displayName: 'ClientOnly',
    with: <TProps extends ComponentProps<ComponentType> = Record<string, never>>(
      clientOnlyProps: PropsWithoutChildren<ClientOnlyProps>,
      Component: ComponentType<TProps>
    ) =>
      Object.assign(
        (props: TProps) => (
          <ClientOnly {...clientOnlyProps}>
            <Component {...props} />
          </ClientOnly>
        ),
        { displayName: `${ClientOnly.displayName}.with(${Component.displayName || Component.name || 'Component'})` }
      ),
  }
)
