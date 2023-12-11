import { ComponentProps, ComponentType } from 'react';

type PropsWithoutChildren<TProps extends ComponentProps<ComponentType>> = Omit<TProps, 'children'>;

export type { PropsWithoutChildren as P };
