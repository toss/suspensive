import { ComponentProps } from 'react';
import { ErrorBoundary, ResetRef } from './ErrorBoundary';
import { Suspense } from './Suspense';
type SuspenseProps = ComponentProps<typeof Suspense>;
type ErrorBoundaryProps = ComponentProps<typeof ErrorBoundary>;
type Props = Omit<SuspenseProps, 'fallback'> & Omit<ErrorBoundaryProps, 'fallback'> & {
    pendingFallback: SuspenseProps['fallback'];
    rejectedFallback: ErrorBoundaryProps['fallback'];
};
declare const CSROnlyAsyncBoundary: import("react").ForwardRefExoticComponent<Pick<Props, "key" | "children" | "onReset" | "onError" | "resetKeys" | "pendingFallback" | "rejectedFallback"> & import("react").RefAttributes<ResetRef>>;
export declare const AsyncBoundary: import("react").ForwardRefExoticComponent<Pick<Props, "key" | "children" | "onReset" | "onError" | "resetKeys" | "pendingFallback" | "rejectedFallback"> & import("react").RefAttributes<ResetRef>> & {
    CSROnly: typeof CSROnlyAsyncBoundary;
};
export {};
