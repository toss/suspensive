var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { AsyncBoundary } from '@suspensive/react-boundary';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
const BaseQueryAsyncBoundary = forwardRef(function BaseQueryAsyncBoundary(_a, resetRef) {
    var { onReset } = _a, props = __rest(_a, ["onReset"]);
    const { reset } = useQueryErrorResetBoundary();
    return (_jsx(AsyncBoundary, Object.assign({}, props, { onReset: () => {
            reset();
            onReset === null || onReset === void 0 ? void 0 : onReset();
        }, ref: resetRef })));
});
const ResetKeyQueryAsyncBoundary = forwardRef(function ResetKeyQueryAsyncBoundary(_a, resetRef) {
    var { onReset } = _a, props = __rest(_a, ["onReset"]);
    const { reset } = useQueryErrorResetBoundary();
    return (_jsx(AsyncBoundary.ResetKey, Object.assign({}, props, { onReset: () => {
            reset();
            onReset === null || onReset === void 0 ? void 0 : onReset();
        }, ref: resetRef })));
});
const BaseCSROnlyQueryAsyncBoundary = forwardRef(function BaseCSROnlyQueryAsyncBoundary(_a, resetRef) {
    var { onReset } = _a, props = __rest(_a, ["onReset"]);
    const { reset } = useQueryErrorResetBoundary();
    return (_jsx(AsyncBoundary.CSROnly, Object.assign({}, props, { onReset: () => {
            reset();
            onReset === null || onReset === void 0 ? void 0 : onReset();
        }, ref: resetRef })));
});
const ResetKeyCSROnlyQueryAsyncBoundary = forwardRef(function ResetKeyCSROnlyQueryAsyncBoundary(_a, resetRef) {
    var { onReset } = _a, props = __rest(_a, ["onReset"]);
    const { reset } = useQueryErrorResetBoundary();
    return (_jsx(AsyncBoundary.CSROnly.ResetKey, Object.assign({}, props, { onReset: () => {
            reset();
            onReset === null || onReset === void 0 ? void 0 : onReset();
        }, ref: resetRef })));
});
const CSROnlyQueryAsyncBoundary = BaseCSROnlyQueryAsyncBoundary;
CSROnlyQueryAsyncBoundary.ResetKey = ResetKeyCSROnlyQueryAsyncBoundary;
export const QueryAsyncBoundary = BaseQueryAsyncBoundary;
QueryAsyncBoundary.CSROnly = CSROnlyQueryAsyncBoundary;
QueryAsyncBoundary.ResetKey = ResetKeyQueryAsyncBoundary;
//# sourceMappingURL=QueryAsyncBoundary.js.map