import { ComponentProps, ComponentType, ReactNode } from 'react';
declare const ResetKeyProvider: (props: {
    children: ReactNode;
}) => JSX.Element;
declare const ResetKeyConsumer: import("react").Consumer<{
    resetKey: {};
    reset: () => void;
}>;
export declare const ResetKey: ((props: ComponentProps<typeof ResetKeyConsumer>) => JSX.Element) & {
    Provider: typeof ResetKeyProvider;
    Consumer: typeof ResetKeyConsumer;
};
export declare const useResetKey: () => {
    resetKey: {};
    reset: () => void;
};
declare const withResetKeyProvider: <P extends Record<string, unknown> = Record<string, never>>(Component: ComponentType<P>) => (props: P) => JSX.Element;
declare const withResetKeyConsumer: <P extends Record<string, unknown> = Record<string, never>>(Component: ComponentType<{
    resetKey: {};
    reset: () => void;
} & P>) => (props: P) => JSX.Element;
export declare const withResetKey: (<P extends Record<string, unknown> = Record<string, never>>(Component: ComponentType<P & {
    resetKey: {};
    reset: () => void;
}>) => (props: P) => JSX.Element) & {
    Provider: typeof withResetKeyProvider;
    Consumer: typeof withResetKeyConsumer;
};
export {};
