import { jsx as _jsx } from "react/jsx-runtime";
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { forwardRef } from 'react';
import { AsyncBoundary } from '@suspensive/react-boundary';
const BaseResetSuspenseQueryBoundary = forwardRef(function BaseResetSuspenseQueryBoundary(props, resetRef) {
    return (_jsx(QueryErrorResetBoundary, { children: ({ reset }) => _jsx(AsyncBoundary, Object.assign({ ref: resetRef }, props, { onReset: reset })) }));
});
const CSROnlyResetSuspenseQueryBoundary = forwardRef(function CSROnlyResetSuspenseQueryBoundary(props, resetRef) {
    return (_jsx(QueryErrorResetBoundary, { children: ({ reset }) => (_jsx(AsyncBoundary.CSROnly, Object.assign({ ref: resetRef }, props, { onReset: reset }))) }));
});
export const ResetSuspenseQueryBoundary = BaseResetSuspenseQueryBoundary;
ResetSuspenseQueryBoundary.CSROnly = CSROnlyResetSuspenseQueryBoundary;
//# sourceMappingURL=ResetSuspenseQueryBoundary.js.map