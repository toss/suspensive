import type { ComponentProps, ComponentType } from 'react'

export type PropsWithoutChildren<TProps extends ComponentProps<ComponentType>> = Omit<TProps, 'children'>
