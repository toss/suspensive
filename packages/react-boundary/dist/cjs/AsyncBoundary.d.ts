import { ComponentProps } from 'react';
import { Suspense, ErrorBoundary } from '.';
type SuspenseProps = ComponentProps<typeof Suspense>;
type ErrorBoundaryProps = ComponentProps<typeof ErrorBoundary>;
interface Props extends Omit<SuspenseProps, 'fallback'>, Omit<ErrorBoundaryProps, 'fallback'> {
    pendingFallback: SuspenseProps['fallback'];
    rejectedFallback: ErrorBoundaryProps['fallback'];
}
interface ResetRef {
    reset?(): void;
}
declare const CSROnlyAsyncBoundary: import("react").ForwardRefExoticComponent<Props & import("react").RefAttributes<ResetRef>>;
export declare const AsyncBoundary: import("react").ForwardRefExoticComponent<Props & import("react").RefAttributes<ResetRef>> & {
    CSROnly: typeof CSROnlyAsyncBoundary;
};
export {};
