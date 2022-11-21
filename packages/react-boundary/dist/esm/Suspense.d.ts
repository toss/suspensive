import { CSROnlySuspense } from './components';
import { SuspenseProps } from 'react';
export declare const Suspense: ((props: SuspenseProps) => JSX.Element) & {
    CSROnly: typeof CSROnlySuspense;
};
