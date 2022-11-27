import { Component, ErrorInfo, PropsWithChildren, PropsWithRef, ReactNode } from 'react';
export type ResetRef = {
    reset?(): void;
};
type Props = PropsWithRef<PropsWithChildren<{
    resetKeys?: unknown[];
    onReset?(): void;
    onError?(error: Error, info: ErrorInfo): void;
    fallback: ReactNode | ((props: {
        error: Error;
        reset: (...args: unknown[]) => void;
    }) => ReactNode);
}>>;
type State = {
    error: Error | null;
};
export declare class BaseErrorBoundary extends Component<Props, State> {
    static getDerivedStateFromError(error: Error): {
        error: Error;
    };
    state: State;
    resetErrorBoundary: () => void;
    reset(): void;
    componentDidCatch(error: Error, info: ErrorInfo): void;
    componentDidUpdate(prevProps: Props, prevState: State): void;
    render(): ReactNode;
}
export declare const ResetKeyErrorBoundary: import("react").ForwardRefExoticComponent<{
    resetKeys?: unknown[] | undefined;
    onReset?(): void;
    onError?(error: Error, info: ErrorInfo): void;
    fallback: ReactNode | ((props: {
        error: Error;
        reset: (...args: unknown[]) => void;
    }) => ReactNode);
} & {
    children?: ReactNode;
} & import("react").RefAttributes<ResetRef>>;
export declare const ErrorBoundary: typeof BaseErrorBoundary & {
    ResetKey: typeof ResetKeyErrorBoundary;
};
export {};
