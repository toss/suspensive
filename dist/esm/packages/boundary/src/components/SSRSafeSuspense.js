import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Suspense as BaseSuspense } from 'react';
import { useIsMounted } from '../hooks';
export const SSRSafeSuspense = props => {
    const isMounted = useIsMounted();
    return isMounted ? _jsx(BaseSuspense, Object.assign({}, props)) : _jsx(_Fragment, { children: props.fallback });
};
//# sourceMappingURL=SSRSafeSuspense.js.map