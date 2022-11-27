import { ComponentProps } from 'react';
import { ResetRef } from './ErrorBoundary';
import { ErrorBoundary, Suspense } from '.';
type SuspenseProps = ComponentProps<typeof Suspense>;
type ErrorBoundaryProps = ComponentProps<typeof ErrorBoundary>;
declare const ResetKeyCSROnlyAsyncBoundary: import("react").ForwardRefExoticComponent<Omit<import("react").SuspenseProps, "fallback"> & Omit<{
    resetKeys?: unknown[] | undefined;
    onReset?(): void;
    onError?(error: Error, info: import("react").ErrorInfo): void;
    fallback: import("react").ReactNode | ((props: {
        error: Error;
        reset: (...args: unknown[]) => void;
    }) => import("react").ReactNode);
} & {
    children?: import("react").ReactNode;
}, "fallback"> & {
    pendingFallback: SuspenseProps['fallback'];
    rejectedFallback: ErrorBoundaryProps['fallback'];
} & import("react").RefAttributes<ResetRef>>;
declare const ResetKeyAsyncBoundary: import("react").ForwardRefExoticComponent<Omit<import("react").SuspenseProps, "fallback"> & Omit<{
    resetKeys?: unknown[] | undefined;
    onReset?(): void;
    onError?(error: Error, info: import("react").ErrorInfo): void;
    fallback: import("react").ReactNode | ((props: {
        error: Error;
        reset: (...args: unknown[]) => void;
    }) => import("react").ReactNode);
} & {
    children?: import("react").ReactNode;
}, "fallback"> & {
    pendingFallback: SuspenseProps['fallback'];
    rejectedFallback: ErrorBoundaryProps['fallback'];
} & import("react").RefAttributes<ResetRef>>;
declare const CSROnlyAsyncBoundary: import("react").ForwardRefExoticComponent<Omit<import("react").SuspenseProps, "fallback"> & Omit<{
    resetKeys?: unknown[] | undefined;
    onReset?(): void;
    onError?(error: Error, info: import("react").ErrorInfo): void;
    fallback: import("react").ReactNode | ((props: {
        error: Error;
        reset: (...args: unknown[]) => void;
    }) => import("react").ReactNode);
} & {
    children?: import("react").ReactNode;
}, "fallback"> & {
    pendingFallback: SuspenseProps['fallback'];
    rejectedFallback: ErrorBoundaryProps['fallback'];
} & import("react").RefAttributes<ResetRef>> & {
    ResetKey: typeof ResetKeyCSROnlyAsyncBoundary;
};
export declare const AsyncBoundary: import("react").ForwardRefExoticComponent<Omit<import("react").SuspenseProps, "fallback"> & Omit<{
    resetKeys?: unknown[] | undefined;
    onReset?(): void;
    onError?(error: Error, info: import("react").ErrorInfo): void;
    fallback: import("react").ReactNode | ((props: {
        error: Error;
        reset: (...args: unknown[]) => void;
    }) => import("react").ReactNode);
} & {
    children?: import("react").ReactNode;
}, "fallback"> & {
    pendingFallback: SuspenseProps['fallback'];
    rejectedFallback: ErrorBoundaryProps['fallback'];
} & import("react").RefAttributes<ResetRef>> & {
    CSROnly: typeof CSROnlyAsyncBoundary;
    ResetKey: typeof ResetKeyAsyncBoundary;
};
export {};
