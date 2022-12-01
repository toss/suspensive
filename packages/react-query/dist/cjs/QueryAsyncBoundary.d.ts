import { ResetRef } from '@suspensive/react';
declare const CSROnlyQueryAsyncBoundary: import("react").ForwardRefExoticComponent<Pick<Pick<Omit<import("react").SuspenseProps, "fallback"> & Omit<{
    resetKeys?: unknown[] | undefined;
    onReset?(): void;
    onError?(error: Error, info: import("react").ErrorInfo): void;
    fallback: import("react").ReactNode | ((props: {
        error: Error;
        reset: (...args: unknown[]) => void;
    }) => import("react").ReactNode);
} & {
    children?: import("react").ReactNode;
} & import("react").RefAttributes<ResetRef>, "fallback"> & {
    pendingFallback: import("react").ReactNode;
    rejectedFallback: import("react").ReactNode | ((props: {
        error: Error;
        reset: (...args: unknown[]) => void;
    }) => import("react").ReactNode);
}, "key" | "children" | "onReset" | "onError" | "resetKeys" | "pendingFallback" | "rejectedFallback"> & import("react").RefAttributes<ResetRef>, "key" | "children" | "onReset" | "onError" | "resetKeys" | "pendingFallback" | "rejectedFallback"> & import("react").RefAttributes<ResetRef>>;
export declare const QueryAsyncBoundary: import("react").ForwardRefExoticComponent<Pick<Pick<Omit<import("react").SuspenseProps, "fallback"> & Omit<{
    resetKeys?: unknown[] | undefined;
    onReset?(): void;
    onError?(error: Error, info: import("react").ErrorInfo): void;
    fallback: import("react").ReactNode | ((props: {
        error: Error;
        reset: (...args: unknown[]) => void;
    }) => import("react").ReactNode);
} & {
    children?: import("react").ReactNode;
} & import("react").RefAttributes<ResetRef>, "fallback"> & {
    pendingFallback: import("react").ReactNode;
    rejectedFallback: import("react").ReactNode | ((props: {
        error: Error;
        reset: (...args: unknown[]) => void;
    }) => import("react").ReactNode);
}, "key" | "children" | "onReset" | "onError" | "resetKeys" | "pendingFallback" | "rejectedFallback"> & import("react").RefAttributes<ResetRef>, "key" | "children" | "onReset" | "onError" | "resetKeys" | "pendingFallback" | "rejectedFallback"> & import("react").RefAttributes<ResetRef>> & {
    CSROnly: typeof CSROnlyQueryAsyncBoundary;
};
export {};
