import { ErrorInfo, ReactNode } from 'react';
export type ResetRef = {
    reset?(): void;
};
export declare const ErrorBoundary: import("react").ForwardRefExoticComponent<{
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
