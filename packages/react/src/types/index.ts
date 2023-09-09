import { ComponentProps, JSXElementConstructor } from 'react'

export type ComponentPropsWithoutChildren<TComponent extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
  Omit<ComponentProps<TComponent>, 'children'>
export type PropsWithoutChildren<TProps> = Omit<TProps, 'children'>

export type Tuple<T = unknown> = T[] | readonly T[]
