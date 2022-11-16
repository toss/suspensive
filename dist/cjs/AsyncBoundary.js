"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncBoundary = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const _1 = require(".");
const BaseAsyncBoundary = (0, react_1.forwardRef)(function AsyncBoundary(_a, resetRef) {
    var { ssrSafe, pendingFallback, rejectedFallback, children } = _a, errorBoundaryProps = __rest(_a, ["ssrSafe", "pendingFallback", "rejectedFallback", "children"]);
    const ref = (0, react_1.useRef)(null);
    (0, react_1.useImperativeHandle)(resetRef, () => ({
        reset: () => { var _a; return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.resetErrorBoundary(); },
    }));
    const SelectedSuspense = ssrSafe ? _1.SSRSafeSuspense : react_1.Suspense;
    return ((0, jsx_runtime_1.jsx)(_1.ErrorBoundary, Object.assign({ ref: ref, fallback: rejectedFallback }, errorBoundaryProps, { children: (0, jsx_runtime_1.jsx)(SelectedSuspense, Object.assign({ fallback: pendingFallback }, { children: children })) })));
});
const AsyncBoundary = BaseAsyncBoundary;
exports.AsyncBoundary = AsyncBoundary;
AsyncBoundary.SSRSafe = (0, react_1.forwardRef)(function SSRSafeAsyncBoundary(props, resetRef) {
    return (0, jsx_runtime_1.jsx)(AsyncBoundary, Object.assign({ ssrSafe: true, ref: resetRef }, props));
});
AsyncBoundary.CSROnly = (0, react_1.forwardRef)(function CSROnlyAsyncBoundary(props, resetRef) {
    return (0, jsx_runtime_1.jsx)(AsyncBoundary, Object.assign({ ref: resetRef }, props));
});
//# sourceMappingURL=AsyncBoundary.js.map