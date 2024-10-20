import { type PropsWithChildren, useMemo } from 'react'
import { DefaultProps, DefaultPropsProvider } from './DefaultProps'
import { Message_DefaultProp_delay_ms_should_be_greater_than_0, SuspensiveError } from './models/SuspensiveError'

type LowercaseFirstLetter<TString extends string> = TString extends `${infer TFirst}${infer TRest}`
  ? `${Lowercase<TFirst>}${TRest}`
  : TString

type LowercaseFirstDepthFieldOf<TObject> = {
  [TKey in keyof TObject as LowercaseFirstLetter<Extract<TKey, string>>]: TObject[TKey]
}

/**
 * @deprecated Use DefaultProps instead
 */
export class Suspensive {
  public defaultProps?: LowercaseFirstDepthFieldOf<DefaultProps>

  constructor(
    /**
     * @deprecated Use DefaultProps instead
     */
    config: {
      /**
       * @deprecated Use DefaultProps instead
       */
      defaultProps?: LowercaseFirstDepthFieldOf<DefaultProps>
    } = {}
  ) {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    if (process.env.NODE_ENV === 'development' && typeof config.defaultProps?.delay?.ms === 'number') {
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      SuspensiveError.assert(config.defaultProps.delay.ms > 0, Message_DefaultProp_delay_ms_should_be_greater_than_0)
    }
    // eslint-disable-next-line @typescript-eslint/no-deprecated
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
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  value: Suspensive
}

/**
 * @deprecated Use DefaultPropsProvider instead
 */
// eslint-disable-next-line @typescript-eslint/no-deprecated
export const SuspensiveProvider = ({ value, children }: SuspensiveProviderProps) => {
  const defaultProps = useMemo(
    () => new DefaultProps({ Delay: value.defaultProps?.delay, Suspense: value.defaultProps?.suspense }),
    [value.defaultProps?.delay, value.defaultProps?.suspense]
  )

  return value.defaultProps ? (
    <DefaultPropsProvider defaultProps={defaultProps}>{children}</DefaultPropsProvider>
  ) : (
    <>{children}</>
  )
}
