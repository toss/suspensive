import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';
import { PropsWithChildren, ErrorInfo, ReactNode, FunctionComponent, ComponentType } from 'react';
import { P as PropsWithoutChildren } from './PropsWithoutChildren-l3xNTJvW.cjs';

type ErrorBoundaryFallbackProps<TError extends Error = Error> = {
    /**
     * when ErrorBoundary catch error, you can use this error
     */
    error: TError;
    /**
     * when you want to reset caught error, you can use this reset
     */
    reset: () => void;
};
type ErrorBoundaryProps = PropsWithChildren<{
    /**
     * an array of elements for the ErrorBoundary to check each render. If any of those elements change between renders, then the ErrorBoundary will reset the state which will re-render the children
     */
    resetKeys?: unknown[];
    /**
     * when ErrorBoundary is reset by resetKeys or fallback's props.reset, onReset will be triggered
     */
    onReset?(): void;
    /**
     * when ErrorBoundary catch error, onError will be triggered
     */
    onError?(error: Error, info: ErrorInfo): void;
    /**
     * when ErrorBoundary catch error, fallback will be render instead of children
     */
    fallback: ReactNode | FunctionComponent<ErrorBoundaryFallbackProps>;
}>;
/**
 * This component provide a simple and reusable wrapper that you can use to wrap around your components. Any rendering errors in your components hierarchy can then be gracefully handled.
 * @see {@link https://suspensive.org/docs/react/ErrorBoundary}
 */
declare const ErrorBoundary: react.ForwardRefExoticComponent<{
    /**
     * an array of elements for the ErrorBoundary to check each render. If any of those elements change between renders, then the ErrorBoundary will reset the state which will re-render the children
     */
    resetKeys?: unknown[] | undefined;
    /**
     * when ErrorBoundary is reset by resetKeys or fallback's props.reset, onReset will be triggered
     */
    onReset?(): void;
    /**
     * when ErrorBoundary catch error, onError will be triggered
     */
    onError?(error: Error, info: ErrorInfo): void;
    /**
     * when ErrorBoundary catch error, fallback will be render instead of children
     */
    fallback: ReactNode | FunctionComponent<ErrorBoundaryFallbackProps>;
} & {
    children?: ReactNode;
} & react.RefAttributes<{
    reset(): void;
}>>;
/**
 * @deprecated Use wrap.ErrorBoundary().on as alternatives
 */
declare const withErrorBoundary: <TProps extends {} = Record<string, never>>(component: ComponentType<TProps>, errorBoundaryProps: PropsWithoutChildren<ErrorBoundaryProps>) => {
    (props: TProps): react_jsx_runtime.JSX.Element;
    displayName: string;
};
declare const useErrorBoundary: <TError extends Error = Error>() => {
    setError: (error: TError) => void;
};
declare const useErrorBoundaryFallbackProps: <TError extends Error = Error>() => ErrorBoundaryFallbackProps<TError>;

export { ErrorBoundary, type ErrorBoundaryFallbackProps, type ErrorBoundaryProps, useErrorBoundary, useErrorBoundaryFallbackProps, withErrorBoundary };
