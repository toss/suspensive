import { ComponentProps, ComponentType, FC, ReactNode } from 'react';
export declare const ResetBoundaryProvider: FC<{
    children: ReactNode;
}>;
export declare const ResetBoundaryConsumer: import("react").Consumer<{
    resetBoundaryKey: {};
    resetBoundary: () => void;
}>;
export declare const useResetBoundary: () => {
    resetBoundaryKey: {};
    resetBoundary: () => void;
};
export declare const withResetBoundaryProvider: <P extends Record<string, unknown>>(Component: ComponentType<P>) => (props: P) => JSX.Element;
export declare const ResetBoundary: FC<{
    children: ComponentProps<typeof ResetBoundaryConsumer>['children'];
}>;
export declare const withResetBoundary: <P extends Record<string, unknown> = Record<string, never>>(Component: ComponentType<P & {
    resetBoundaryKey: {};
    resetBoundary: () => void;
}>) => FC<P & {
    children: ComponentProps<typeof ResetBoundaryConsumer>['children'];
}>;
