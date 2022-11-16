import { ComponentProps, Suspense } from 'react';
import { ErrorBoundary } from '.';
interface ResetRef {
    reset?(): void;
}
declare const BaseAsyncBoundary: import("react").ForwardRefExoticComponent<Omit<import("react").SuspenseProps, "fallback"> & Omit<{
    resetKeys?: unknown[] | undefined;
    onReset?(): void;
    onError?(error: Error, info: import("react").ErrorInfo): void;
    children?: import("react").ReactNode;
    fallback: import("react").ReactNode | ((props: {
        error: Error;
        reset: (...args: unknown[]) => void;
    }) => import("react").ReactNode);
}, "fallback"> & {
    ssrSafe?: boolean | undefined;
    pendingFallback: ComponentProps<typeof Suspense>['fallback'];
    rejectedFallback: ComponentProps<typeof ErrorBoundary>['fallback'];
} & import("react").RefAttributes<ResetRef>>;
type AsyncBoundaryType = typeof BaseAsyncBoundary & {
    SSRSafe: typeof BaseAsyncBoundary;
    CSROnly: typeof BaseAsyncBoundary;
};
declare const AsyncBoundary: AsyncBoundaryType;
export { AsyncBoundary };
