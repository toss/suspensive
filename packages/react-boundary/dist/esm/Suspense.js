import { jsx as _jsx } from "react/jsx-runtime";
import { CSROnlySuspense } from './components';
import { Suspense as BaseSuspense } from 'react';
const DefaultSuspense = (props) => _jsx(BaseSuspense, Object.assign({}, props));
export const Suspense = DefaultSuspense;
Suspense.CSROnly = CSROnlySuspense;
//# sourceMappingURL=Suspense.js.map