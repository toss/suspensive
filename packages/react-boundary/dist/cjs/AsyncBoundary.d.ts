import { ComponentProps } from 'react';
import { ResetRef } from './types';
import { ErrorBoundary, Suspense } from '.';
type SuspenseProps = ComponentProps<typeof Suspense>;
type ErrorBoundaryProps = ComponentProps<typeof ErrorBoundary>;
interface Props extends Omit<SuspenseProps, 'fallback'>, Omit<ErrorBoundaryProps, 'fallback'> {
    pendingFallback: SuspenseProps['fallback'];
    rejectedFallback: ErrorBoundaryProps['fallback'];
}
declare const ResetKeyCSROnlyAsyncBoundary: import("react").ForwardRefExoticComponent<Props & import("react").RefAttributes<ResetRef>>;
declare const ResetKeyAsyncBoundary: import("react").ForwardRefExoticComponent<Props & import("react").RefAttributes<ResetRef>>;
declare const CSROnlyAsyncBoundary: import("react").ForwardRefExoticComponent<Props & import("react").RefAttributes<ResetRef>> & {
    ResetKey: typeof ResetKeyCSROnlyAsyncBoundary;
};
export declare const AsyncBoundary: import("react").ForwardRefExoticComponent<Props & import("react").RefAttributes<ResetRef>> & {
    CSROnly: typeof CSROnlyAsyncBoundary;
    ResetKey: typeof ResetKeyAsyncBoundary;
};
export {};
