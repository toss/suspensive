import { type ContextType, type PropsWithChildren } from 'react'
import { DelayDefaultPropsContext, SuspenseDefaultPropsContext } from './contexts'
import { Message_DefaultProp_delay_ms_should_be_greater_than_0, SuspensiveError } from './models/SuspensiveError'

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
export const DefaultPropsProvider = ({ defaultProps, children }: DefaultPropsProviderProps) => (
  <DelayDefaultPropsContext.Provider value={defaultProps.Delay ?? {}}>
    <SuspenseDefaultPropsContext.Provider value={defaultProps.Suspense ?? {}}>
      {children}
    </SuspenseDefaultPropsContext.Provider>
  </DelayDefaultPropsContext.Provider>
)
