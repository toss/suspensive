import { ComponentProps } from 'react';
import { AsyncBoundary } from '@suspensive/react-boundary';
import { ResetRef } from './types';
type Props = Pick<ComponentProps<typeof AsyncBoundary>, 'children' | 'pendingFallback' | 'rejectedFallback' | 'resetKeys' | 'onError' | 'onReset' | 'ref' | 'key'>;
declare const ResetKeyQueryAsyncBoundary: import("react").ForwardRefExoticComponent<Pick<Props, "key" | "children" | "onReset" | "onError" | "resetKeys" | "pendingFallback" | "rejectedFallback"> & import("react").RefAttributes<ResetRef>>;
declare const ResetKeyCSROnlyQueryAsyncBoundary: import("react").ForwardRefExoticComponent<Pick<Props, "key" | "children" | "onReset" | "onError" | "resetKeys" | "pendingFallback" | "rejectedFallback"> & import("react").RefAttributes<ResetRef>>;
declare const CSROnlyQueryAsyncBoundary: import("react").ForwardRefExoticComponent<Pick<Props, "key" | "children" | "onReset" | "onError" | "resetKeys" | "pendingFallback" | "rejectedFallback"> & import("react").RefAttributes<ResetRef>> & {
    ResetKey: typeof ResetKeyCSROnlyQueryAsyncBoundary;
};
export declare const QueryAsyncBoundary: import("react").ForwardRefExoticComponent<Pick<Props, "key" | "children" | "onReset" | "onError" | "resetKeys" | "pendingFallback" | "rejectedFallback"> & import("react").RefAttributes<ResetRef>> & {
    CSROnly: typeof CSROnlyQueryAsyncBoundary;
    ResetKey: typeof ResetKeyQueryAsyncBoundary;
};
export {};
