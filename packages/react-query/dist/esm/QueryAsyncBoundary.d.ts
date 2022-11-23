import { ComponentProps } from 'react';
import { AsyncBoundary } from '@suspensive/react-boundary';
import { ResetRef } from './types';
type Props = Pick<ComponentProps<typeof AsyncBoundary>, 'children' | 'pendingFallback' | 'rejectedFallback' | 'resetKeys' | 'onError' | 'onReset'>;
declare const CSROnlyQueryAsyncBoundary: import("react").ForwardRefExoticComponent<Props & import("react").RefAttributes<ResetRef>>;
export declare const QueryAsyncBoundary: import("react").ForwardRefExoticComponent<Props & import("react").RefAttributes<ResetRef>> & {
    CSROnly: typeof CSROnlyQueryAsyncBoundary;
};
export {};
