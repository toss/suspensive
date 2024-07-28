import { type ContextType, type PropsWithChildren } from 'react'
import { DelayDefaultPropsContext, SuspenseDefaultPropsContext } from './contexts'
import { Message_DefaultProp_delay_ms_should_be_greater_than_0, SuspensiveError } from './models/SuspensiveError'

export class DefaultProps {
  suspense?: ContextType<typeof SuspenseDefaultPropsContext>
  delay?: ContextType<typeof DelayDefaultPropsContext>

  constructor(
    defaultProps: {
      suspense?: ContextType<typeof SuspenseDefaultPropsContext>
      delay?: ContextType<typeof DelayDefaultPropsContext>
    } = {}
  ) {
    if (process.env.NODE_ENV === 'development' && typeof defaultProps.delay?.ms === 'number') {
      SuspensiveError.assert(defaultProps.delay.ms > 0, Message_DefaultProp_delay_ms_should_be_greater_than_0)
    }
    this.suspense = defaultProps.suspense
    this.delay = defaultProps.delay
  }
}

interface DefaultPropsProviderProps extends PropsWithChildren {
  defaultProps: DefaultProps
}
export const DefaultPropsProvider = ({ defaultProps, children }: DefaultPropsProviderProps) => (
  <DelayDefaultPropsContext.Provider value={defaultProps.delay ?? {}}>
    <SuspenseDefaultPropsContext.Provider value={defaultProps.suspense ?? {}}>
      {children}
    </SuspenseDefaultPropsContext.Provider>
  </DelayDefaultPropsContext.Provider>
)
