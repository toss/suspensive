import { SuspenseProps } from 'react';
type Props = SuspenseProps;
declare const CSROnlySuspense: (props: Props) => JSX.Element;
export declare const Suspense: ((props: Props) => JSX.Element) & {
    CSROnly: typeof CSROnlySuspense;
};
export {};
