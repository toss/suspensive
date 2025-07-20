import { type ContextType, type PropsWithChildren } from 'react'
import { DelayDefaultPropsContext, SuspenseDefaultPropsContext } from './contexts/DefaultPropsContexts'
import { Message_DefaultProp_delay_ms_should_be_greater_than_0, SuspensiveError } from './models/SuspensiveError'

/**
 * A class for configuring default props for Suspensive components.
 *
 * @example
 * ```tsx
 * const defaultProps = new DefaultProps({
 *   Delay: {
 *     ms: 1200,
 *     fallback: <LoadingMessage>Loading additional content...</LoadingMessage>
 *   },
 *   Suspense: {
 *     fallback: <Spinner>Fetching data...</Spinner>,
 *     clientOnly: false,
 *   },
 * })
 * ```
 */
export class DefaultProps {
  Suspense?: ContextType<typeof SuspenseDefaultPropsContext>
  Delay?: ContextType<typeof DelayDefaultPropsContext>

  constructor(defaultProps: DefaultProps = {}) {
    if (process.env.NODE_ENV === 'development' && typeof defaultProps.Delay?.ms === 'number') {
      SuspensiveError.assert(defaultProps.Delay.ms > 0, Message_DefaultProp_delay_ms_should_be_greater_than_0)
    }
    this.Suspense = defaultProps.Suspense
    this.Delay = defaultProps.Delay
  }
}

interface DefaultPropsProviderProps extends PropsWithChildren {
  defaultProps: DefaultProps
}

/**
 * A provider component that controls the default settings of Suspensive components.
 * Use this to configure default props for Suspense, Delay, and other Suspensive components globally.
 *
 * @example
 * ```tsx
 * const defaultProps = new DefaultProps({
 *   Delay: {
 *     ms: 1000,
 *     fallback: <LoadingSpinner />
 *   },
 *   Suspense: {
 *     fallback: <Skeleton />,
 *     clientOnly: false,
 *   },
 * })
 *
 * function App() {
 *   return (
 *     <DefaultPropsProvider defaultProps={defaultProps}>
 *       <YourApp />
 *     </DefaultPropsProvider>
 *   )
 * }
 * ```
 *
 * @see {@link https://suspensive.org/docs/react/DefaultPropsProvider Suspensive Docs}
 */
export const DefaultPropsProvider = ({ defaultProps, children }: DefaultPropsProviderProps) => (
  <DelayDefaultPropsContext.Provider value={defaultProps.Delay ?? {}}>
    <SuspenseDefaultPropsContext.Provider value={defaultProps.Suspense ?? {}}>
      {children}
    </SuspenseDefaultPropsContext.Provider>
  </DelayDefaultPropsContext.Provider>
)
