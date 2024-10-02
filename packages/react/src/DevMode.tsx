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

interface DevModeProps {
  /**
   * @deprecated Use official react devtools instead
   * @see https://react.dev/learn/react-developer-tools
   */
  position?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
}

/**
 * @deprecated Use official react devtools instead
 * @see https://react.dev/learn/react-developer-tools
 */
export const DevMode = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  props: DevModeProps
) => null
