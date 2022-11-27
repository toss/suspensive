import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Suspense as BaseSuspense } from 'react';
import { useIsMounted } from './hooks';
const DefaultSuspense = (props) => _jsx(BaseSuspense, Object.assign({}, props));
const CSROnlySuspense = (props) => (useIsMounted() ? _jsx(BaseSuspense, Object.assign({}, props)) : _jsx(_Fragment, { children: props.fallback }));
export const Suspense = DefaultSuspense;
Suspense.CSROnly = CSROnlySuspense;
//# sourceMappingURL=Suspense.js.map