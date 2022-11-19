import { ComponentProps, FC, ReactNode } from 'react';
export declare const ResetBoundaryProvider: FC<{
    children: ReactNode;
}>;
export declare const ResetBoundaryConsumer: any;
export declare const useResetBoundary: () => any;
export declare const withResetBoundaryProvider: <P extends Record<string, unknown>>(Component: ComponentType<P>) => (props: P) => any;
export declare const ResetBoundary: FC<{
    children: ComponentProps<typeof ResetBoundaryConsumer>['children'];
}>;
export declare const withResetBoundary: <P extends Record<string, unknown> = Record<string, never>>(Component: ComponentType<P>) => FC<any>;
