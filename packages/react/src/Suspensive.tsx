import { type PropsWithChildren } from 'react'
import { type DefaultProps, DefaultPropsProvider } from './DefaultProps'
import { Message_DefaultProp_delay_ms_should_be_greater_than_0, SuspensiveError } from './models/SuspensiveError'

/**
 * @deprecated Use DefaultProps instead
 */
export class Suspensive {
  public defaultProps?: DefaultProps

  constructor(
    /**
     * @deprecated Use DefaultProps instead
     */
    config: {
      /**
       * @deprecated Use DefaultProps instead
       */
      defaultProps?: DefaultProps
    } = {}
  ) {
    if (process.env.NODE_ENV === 'development' && typeof config.defaultProps?.delay?.ms === 'number') {
      SuspensiveError.assert(config.defaultProps.delay.ms > 0, Message_DefaultProp_delay_ms_should_be_greater_than_0)
    }
    this.defaultProps = config.defaultProps
  }
}

/**
 * @deprecated Use DefaultPropsProvider instead
 */
interface SuspensiveProviderProps extends PropsWithChildren {
  /**
   * @deprecated Use DefaultPropsProvider instead
   */
  value: Suspensive
}

/**
 * @deprecated Use DefaultPropsProvider instead
 */
export const SuspensiveProvider = ({ value, children }: SuspensiveProviderProps) =>
  value.defaultProps ? (
    <DefaultPropsProvider defaultProps={value.defaultProps}>{children}</DefaultPropsProvider>
  ) : (
    <>{children}</>
  )
