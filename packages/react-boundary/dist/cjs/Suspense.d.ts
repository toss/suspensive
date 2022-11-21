import { SuspenseProps } from 'react';
declare const CSROnlySuspense: (props: SuspenseProps) => JSX.Element;
export declare const Suspense: ((props: SuspenseProps) => JSX.Element) & {
    CSROnly: typeof CSROnlySuspense;
};
export {};
