import { ComponentType, ReactNode } from 'react';
export declare const ErrorBoundaryGroup: {
    ({ blockOutside, children, }: {
        blockOutside?: boolean | undefined;
        children?: ReactNode;
    }): JSX.Element;
    Reset: ({ trigger }: {
        trigger: ComponentType<{
            resetGroup: () => void;
        }>;
    }) => JSX.Element;
};
export declare const useErrorBoundaryGroup: () => {
    groupResetKey: {};
    resetGroup: () => void;
};
export declare const withErrorBoundaryGroup: <P extends Record<string, unknown> = Record<string, never>>(Component: ComponentType<P>) => (props: P) => JSX.Element;
