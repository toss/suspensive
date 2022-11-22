import { ComponentProps } from 'react';
import { AsyncBoundary } from '@suspensive/react-boundary';
type Props = Pick<ComponentProps<typeof AsyncBoundary>, 'children' | 'pendingFallback' | 'rejectedFallback' | 'resetKeys'>;
interface ResetRef {
    reset?(): void;
}
declare const CSROnlyResetSuspenseQueryBoundary: import("react").ForwardRefExoticComponent<Props & import("react").RefAttributes<ResetRef>>;
export declare const ResetSuspenseQueryBoundary: import("react").ForwardRefExoticComponent<Props & import("react").RefAttributes<ResetRef>> & {
    CSROnly: typeof CSROnlyResetSuspenseQueryBoundary;
};
export {};
