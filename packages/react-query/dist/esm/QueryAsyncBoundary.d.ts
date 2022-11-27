import { ResetRef } from '@suspensive/react-boundary';
declare const ResetKeyQueryAsyncBoundary: import("react").ForwardRefExoticComponent<Pick<Omit<import("react").SuspenseProps, "fallback"> & Omit<{
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
    pendingFallback: import("react").ReactNode;
    rejectedFallback: import("react").ReactNode | ((props: {
        error: Error;
        reset: (...args: unknown[]) => void;
    }) => import("react").ReactNode);
} & import("react").RefAttributes<ResetRef>, "key" | "children" | "onReset" | "onError" | "resetKeys" | "pendingFallback" | "rejectedFallback"> & import("react").RefAttributes<ResetRef>>;
declare const ResetKeyCSROnlyQueryAsyncBoundary: import("react").ForwardRefExoticComponent<Pick<Omit<import("react").SuspenseProps, "fallback"> & Omit<{
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
    pendingFallback: import("react").ReactNode;
    rejectedFallback: import("react").ReactNode | ((props: {
        error: Error;
        reset: (...args: unknown[]) => void;
    }) => import("react").ReactNode);
} & import("react").RefAttributes<ResetRef>, "key" | "children" | "onReset" | "onError" | "resetKeys" | "pendingFallback" | "rejectedFallback"> & import("react").RefAttributes<ResetRef>>;
declare const CSROnlyQueryAsyncBoundary: import("react").ForwardRefExoticComponent<Pick<Omit<import("react").SuspenseProps, "fallback"> & Omit<{
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
    pendingFallback: import("react").ReactNode;
    rejectedFallback: import("react").ReactNode | ((props: {
        error: Error;
        reset: (...args: unknown[]) => void;
    }) => import("react").ReactNode);
} & import("react").RefAttributes<ResetRef>, "key" | "children" | "onReset" | "onError" | "resetKeys" | "pendingFallback" | "rejectedFallback"> & import("react").RefAttributes<ResetRef>> & {
    ResetKey: typeof ResetKeyCSROnlyQueryAsyncBoundary;
};
export declare const QueryAsyncBoundary: import("react").ForwardRefExoticComponent<Pick<Omit<import("react").SuspenseProps, "fallback"> & Omit<{
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
    pendingFallback: import("react").ReactNode;
    rejectedFallback: import("react").ReactNode | ((props: {
        error: Error;
        reset: (...args: unknown[]) => void;
    }) => import("react").ReactNode);
} & import("react").RefAttributes<ResetRef>, "key" | "children" | "onReset" | "onError" | "resetKeys" | "pendingFallback" | "rejectedFallback"> & import("react").RefAttributes<ResetRef>> & {
    CSROnly: typeof CSROnlyQueryAsyncBoundary;
    ResetKey: typeof ResetKeyQueryAsyncBoundary;
};
export {};
