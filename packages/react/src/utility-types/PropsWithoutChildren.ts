import type { OmitKeyof } from './OmitKeyof'

export type PropsWithoutChildren<T extends { children?: unknown }> = OmitKeyof<T, 'children'>
