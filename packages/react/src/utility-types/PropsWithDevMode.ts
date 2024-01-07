import type { ComponentProps, ComponentType } from 'react'

export type PropsWithDevMode<
  TProps extends ComponentProps<ComponentType>,
  TDevModeProps extends Record<string, unknown>,
> = TProps & {
  /**
   * @experimental This is experimental feature.
   */
  devMode?: TDevModeProps
}
