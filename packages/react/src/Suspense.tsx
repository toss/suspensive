'use client'
import {
  type ComponentProps,
  type ComponentType,
  type ReactNode,
  type SuspenseProps as ReactSuspenseProps,
  useContext,
} from 'react'
import { SuspenseDefaultPropsContext } from './contexts/DefaultPropsContexts'
import type { PropsWithoutChildren } from './utility-types/PropsWithoutChildren'
import { defineSuspense } from './utils/defineSuspense'

export interface SuspenseProps extends ReactSuspenseProps {
  /**
   * With clientOnly prop, `<Suspense/>` will return fallback in server but after mount return children in client. Since mount only happens on the client, `<Suspense/>` can be avoid server-side rendering.
   * @see https://suspensive.org/docs/react/Suspense#avoid-server-side-rendering-clientonly
   */
  clientOnly?: boolean
}

type SuspenseWithProps<TProps> = PropsWithoutChildren<
  Omit<SuspenseProps, 'fallback'> & {
    fallback?: SuspenseProps['fallback'] | ((props: TProps) => ReactNode)
  }
>

/**
 * This component is just wrapping React's Suspense. to use Suspense easily in Server-side rendering environment like Next.js
 * @see {@link https://suspensive.org/docs/react/Suspense Suspensive Docs}
 */
export const Suspense = Object.assign(
  ({ clientOnly, fallback, children, name, ...rest }: SuspenseProps) => {
    const defaultProps = useContext(SuspenseDefaultPropsContext)
    const DefinedSuspense = defineSuspense({
      defaultPropsClientOnly: defaultProps.clientOnly,
      componentPropsClientOnly: clientOnly,
    })
    return (
      <DefinedSuspense {...rest} fallback={fallback === undefined ? defaultProps.fallback : fallback} name={name}>
        {children}
      </DefinedSuspense>
    )
  },
  {
    displayName: 'Suspense',
    with: <TProps extends ComponentProps<ComponentType> = Record<string, never>>(
      suspenseProps: SuspenseWithProps<TProps>,
      Component: ComponentType<TProps>
    ) =>
      Object.assign(
        (props: TProps) => {
          const { fallback, ...restSuspenseProps } = suspenseProps

          return (
            <Suspense {...restSuspenseProps} fallback={typeof fallback === 'function' ? fallback(props) : fallback}>
              <Component {...props} />
            </Suspense>
          )
        },
        { displayName: `${Suspense.displayName}.with(${Component.displayName || Component.name || 'Component'})` }
      ),
  }
)
