import type { ComponentProps, ComponentType } from 'react'

export type PropsWithDevMode<
  TProps extends ComponentProps<ComponentType>,
  TDevModeProps extends Record<string, unknown>,
> = TProps & {
  /**
   * @deprecated Use official react devtools instead
   * @see https://react.dev/learn/react-developer-tools
   */
  devMode?: TDevModeProps
}
