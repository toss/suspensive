import * as react from 'react';
import { PropsWithChildren, ComponentType } from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';
import { P as PropsWithoutChildren } from './PropsWithoutChildren-l3xNTJvW.cjs';

type DelayProps = PropsWithChildren<{
    ms?: number;
}>;
declare const Delay: {
    ({ ms, children }: DelayProps): react_jsx_runtime.JSX.Element;
    displayName: string;
};
declare const DelayContext: react.Context<PropsWithoutChildren<DelayProps>>;
/**
 * @deprecated Use wrap.Delay().on as alternatives
 */
declare const withDelay: <TProps extends {} = Record<string, never>>(component: ComponentType<TProps>, delayProps?: PropsWithoutChildren<DelayProps>) => {
    (props: TProps): react_jsx_runtime.JSX.Element;
    displayName: string;
};

export { Delay, DelayContext, type DelayProps, withDelay };
