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
import { Suspense, ErrorBoundary } from '.';
const BaseAsyncBoundary = forwardRef(function AsyncBoundary(_a, resetRef) {
    var { ssrSafe, pendingFallback, rejectedFallback, children } = _a, errorBoundaryProps = __rest(_a, ["ssrSafe", "pendingFallback", "rejectedFallback", "children"]);
    const ref = useRef(null);
    useImperativeHandle(resetRef, () => ({
        reset: () => { var _a; return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.resetErrorBoundary(); },
    }));
    const SelectedSuspense = ssrSafe ? Suspense.SSRSafe : Suspense.CSROnly;
    return (_jsx(ErrorBoundary, Object.assign({ ref: ref, fallback: rejectedFallback }, errorBoundaryProps, { children: _jsx(SelectedSuspense, Object.assign({ fallback: pendingFallback }, { children: children })) })));
});
export const AsyncBoundary = BaseAsyncBoundary;
AsyncBoundary.SSRSafe = forwardRef(function SSRSafeAsyncBoundary(props, resetRef) {
    return _jsx(AsyncBoundary, Object.assign({ ssrSafe: true, ref: resetRef }, props));
});
AsyncBoundary.CSROnly = forwardRef(function CSROnlyAsyncBoundary(props, resetRef) {
    return _jsx(AsyncBoundary, Object.assign({ ref: resetRef }, props));
});
//# sourceMappingURL=AsyncBoundary.js.map