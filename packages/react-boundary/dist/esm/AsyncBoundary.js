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
const BaseAsyncBoundary = forwardRef(function BaseAsyncBoundary(_a, resetRef) {
    var { pendingFallback, rejectedFallback, children } = _a, errorBoundaryProps = __rest(_a, ["pendingFallback", "rejectedFallback", "children"]);
    const ref = useRef(null);
    useImperativeHandle(resetRef, () => ({
        reset: () => { var _a; return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.resetErrorBoundary(); },
    }));
    return (_jsx(ErrorBoundary, Object.assign({}, errorBoundaryProps, { ref: ref, fallback: rejectedFallback }, { children: _jsx(Suspense, Object.assign({ fallback: pendingFallback }, { children: children })) })));
});
const CSROnlyAsyncBoundary = forwardRef(function CSROnlyAsyncBoundary(_a, resetRef) {
    var { pendingFallback, rejectedFallback, children } = _a, errorBoundaryProps = __rest(_a, ["pendingFallback", "rejectedFallback", "children"]);
    const ref = useRef(null);
    useImperativeHandle(resetRef, () => ({
        reset: () => { var _a; return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.resetErrorBoundary(); },
    }));
    return (_jsx(ErrorBoundary, Object.assign({}, errorBoundaryProps, { ref: ref, fallback: rejectedFallback }, { children: _jsx(Suspense.CSROnly, Object.assign({ fallback: pendingFallback }, { children: children })) })));
});
export const AsyncBoundary = BaseAsyncBoundary;
AsyncBoundary.CSROnly = CSROnlyAsyncBoundary;
//# sourceMappingURL=AsyncBoundary.js.map