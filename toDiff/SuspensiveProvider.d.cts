import * as react_jsx_runtime from 'react/jsx-runtime';
import { DelayProps, DelayContext } from './Delay.cjs';
import { P as PropsWithoutChildren } from './PropsWithoutChildren-l3xNTJvW.cjs';
import * as react from 'react';
import { ContextType, PropsWithChildren } from 'react';
import { SuspenseContext } from './Suspense.cjs';

interface Configs {
    defaultOptions?: {
        suspense?: ContextType<typeof SuspenseContext>;
        delay?: ContextType<typeof DelayContext>;
    };
}
declare class Suspensive implements Configs {
    defaultOptions: {
        suspense?: PropsWithoutChildren<react.SuspenseProps> | undefined;
        delay?: PropsWithoutChildren<DelayProps> | undefined;
    } | undefined;
    constructor(config?: Configs);
}
type SuspensiveProviderProps = PropsWithChildren<{
    value: Suspensive;
}>;
declare const SuspensiveProvider: ({ value, children }: SuspensiveProviderProps) => react_jsx_runtime.JSX.Element;

export { Suspensive, SuspensiveProvider };
