import { ComponentProps, ComponentType } from 'react';
import { Suspense, ErrorBoundary } from '.';
interface ResetRef {
    reset?(): void;
}
type SSROrCSRAsyncBoundaryProps = Omit<ComponentProps<typeof AsyncBoundary>, 'ssrSafe'>;
export declare const AsyncBoundary: import("react").ForwardRefExoticComponent<Omit<import("react").SuspenseProps & {
    ssrSafe?: boolean | undefined;
}, "fallback"> & Omit<{
    resetKeys?: unknown[] | undefined;
    onReset?(): void;
    onError?(error: Error, info: import("react").ErrorInfo): void;
    children?: import("react").ReactNode;
    fallback: import("react").ReactNode | ((props: {
        error: Error;
        reset: (...args: unknown[]) => void;
    }) => import("react").ReactNode);
}, "fallback"> & Pick<import("react").SuspenseProps & {
    ssrSafe?: boolean | undefined;
}, "ssrSafe"> & {
    pendingFallback: ComponentProps<typeof Suspense>['fallback'];
    rejectedFallback: ComponentProps<typeof ErrorBoundary>['fallback'];
} & import("react").RefAttributes<ResetRef>> & {
    SSRSafe: ComponentType<SSROrCSRAsyncBoundaryProps>;
    CSROnly: ComponentType<SSROrCSRAsyncBoundaryProps>;
};
export {};
