import { ComponentType, FC, ReactNode } from 'react';
export declare const ResetBoundaryProvider: FC<{
    children: ReactNode;
}>;
export declare const ResetBoundaryConsumer: import("react").Consumer<{
    resetKey: number;
    reset: () => void;
}>;
export declare const useResetBoundary: () => {
    resetKey: number;
    reset: () => void;
};
export declare const withResetBoundary: <P extends Record<string, unknown>>(Component: ComponentType<P>) => (props: P) => JSX.Element;
