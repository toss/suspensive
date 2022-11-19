import { SSRSafeSuspense } from './components';
import { FC, Suspense as BaseSuspense } from 'react';
export declare const Suspense: FC<import("react").SuspenseProps & {
    ssrSafe?: boolean | undefined;
}> & {
    CSROnly: typeof BaseSuspense;
    SSRSafe: typeof SSRSafeSuspense;
};
