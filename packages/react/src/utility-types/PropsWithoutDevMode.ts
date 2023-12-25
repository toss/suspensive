import type { ComponentProps, ComponentType } from 'react'

export type PropsWithoutDevMode<TProps extends ComponentProps<ComponentType>> = Omit<TProps, 'devMode'>
