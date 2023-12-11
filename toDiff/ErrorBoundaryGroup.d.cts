import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';
import { PropsWithChildren, ComponentType } from 'react';
import { P as PropsWithoutChildren } from './PropsWithoutChildren-l3xNTJvW.cjs';

declare const ErrorBoundaryGroupContext: react.Context<{
    reset: () => void;
    resetKey: number;
} | undefined>;
type ErrorBoundaryGroupProps = PropsWithChildren<{
    /**
     * If you use blockOutside as true, ErrorBoundaryGroup will protect multiple ErrorBoundaries as its children from external ErrorBoundaryGroup's resetKey
     * @default false
     */
    blockOutside?: boolean;
}>;
/**
 * ErrorBoundaryGroup is Component to manage multiple ErrorBoundaries
 * @see {@link https://suspensive.org/docs/react/ErrorBoundaryGroup}
 */
declare const ErrorBoundaryGroup: {
    ({ blockOutside, children }: ErrorBoundaryGroupProps): react_jsx_runtime.JSX.Element;
    displayName: string;
    Reset: ({ trigger: Trigger, }: {
        /**
         * When you want to reset multiple ErrorBoundaries as children of ErrorBoundaryGroup, You can combine any other components with this trigger's reset
         */
        trigger: ComponentType<ReturnType<typeof useErrorBoundaryGroup>>;
    }) => react_jsx_runtime.JSX.Element;
};
declare const useErrorBoundaryGroup: () => {
    /**
     * When you want to reset multiple ErrorBoundaries as children of ErrorBoundaryGroup, You can use this reset
     */
    reset: () => void;
};
/**
 * @deprecated Use wrap.ErrorBoundaryGroup().on as alternatives
 */
declare const withErrorBoundaryGroup: <TProps extends {} = Record<string, never>>(component: ComponentType<TProps>, errorBoundaryGroupProps?: PropsWithoutChildren<ErrorBoundaryGroupProps>) => {
    (props: TProps): react_jsx_runtime.JSX.Element;
    displayName: string;
};

export { ErrorBoundaryGroup, ErrorBoundaryGroupContext, type ErrorBoundaryGroupProps, useErrorBoundaryGroup, withErrorBoundaryGroup };
