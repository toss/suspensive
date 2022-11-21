import { Component, ErrorInfo, PropsWithChildren, PropsWithRef, ReactNode } from 'react';
type Props = PropsWithRef<PropsWithChildren<{
    resetKeys?: unknown[];
    onReset?(): void;
    onError?(error: Error, info: ErrorInfo): void;
    fallback: ReactNode | ((props: {
        error: Error;
        reset: (...args: unknown[]) => void;
    }) => ReactNode);
}>>;
interface State {
    error: Error | null;
}
export declare class ErrorBoundary extends Component<Props, State> {
    static getDerivedStateFromError(error: Error): {
        error: Error;
    };
    state: State;
    resetErrorBoundary: () => void;
    reset(): void;
    componentDidCatch(error: Error, info: ErrorInfo): void;
    componentDidUpdate(prevProps: Props, prevState: State): void;
    render(): ReactNode;
}
export {};
