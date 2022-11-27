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
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { ErrorBoundary } from '@suspensive/react-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
const BaseQueryErrorBoundary = forwardRef((_a, resetRef) => {
    var { onReset } = _a, props = __rest(_a, ["onReset"]);
    const ref = useRef(null);
    useImperativeHandle(resetRef, () => ({
        reset: () => { var _a; return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.resetErrorBoundary(); },
    }));
    return (_jsx(QueryErrorResetBoundary, { children: ({ reset }) => (_jsx(ErrorBoundary, Object.assign({}, props, { onReset: () => {
                onReset === null || onReset === void 0 ? void 0 : onReset();
                reset();
            }, ref: ref }))) }));
});
const ResetKeyQueryErrorBoundary = forwardRef((_a, resetRef) => {
    var { onReset } = _a, props = __rest(_a, ["onReset"]);
    const ref = useRef(null);
    useImperativeHandle(resetRef, () => ({
        reset: () => { var _a; return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.resetErrorBoundary(); },
    }));
    return (_jsx(QueryErrorResetBoundary, { children: ({ reset }) => (_jsx(ErrorBoundary.ResetKey, Object.assign({}, props, { onReset: () => {
                onReset === null || onReset === void 0 ? void 0 : onReset();
                reset();
            }, ref: ref }))) }));
});
export const QueryErrorBoundary = BaseQueryErrorBoundary;
QueryErrorBoundary.ResetKey = ResetKeyQueryErrorBoundary;
//# sourceMappingURL=QueryErrorBoundary.js.map