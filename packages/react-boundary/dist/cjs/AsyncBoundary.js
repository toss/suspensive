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
const ResetKey_1 = require("./ResetKey");
const _1 = require(".");
const BaseAsyncBoundary = (0, react_1.forwardRef)(function BaseAsyncBoundary(_a, resetRef) {
    var { pendingFallback, rejectedFallback, children } = _a, errorBoundaryProps = __rest(_a, ["pendingFallback", "rejectedFallback", "children"]);
    const ref = (0, react_1.useRef)(null);
    (0, react_1.useImperativeHandle)(resetRef, () => ({
        reset: () => { var _a; return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.resetErrorBoundary(); },
    }));
    return ((0, jsx_runtime_1.jsx)(_1.ErrorBoundary, Object.assign({}, errorBoundaryProps, { ref: ref, fallback: rejectedFallback }, { children: (0, jsx_runtime_1.jsx)(_1.Suspense, Object.assign({ fallback: pendingFallback }, { children: children })) })));
});
const BaseCSROnlyAsyncBoundary = (0, react_1.forwardRef)(function CSROnlyAsyncBoundary(_a, resetRef) {
    var { pendingFallback, rejectedFallback, children } = _a, errorBoundaryProps = __rest(_a, ["pendingFallback", "rejectedFallback", "children"]);
    const ref = (0, react_1.useRef)(null);
    (0, react_1.useImperativeHandle)(resetRef, () => ({
        reset: () => { var _a; return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.resetErrorBoundary(); },
    }));
    return ((0, jsx_runtime_1.jsx)(_1.ErrorBoundary, Object.assign({}, errorBoundaryProps, { ref: ref, fallback: rejectedFallback }, { children: (0, jsx_runtime_1.jsx)(_1.Suspense.CSROnly, Object.assign({ fallback: pendingFallback }, { children: children })) })));
});
const ResetKeyCSROnlyAsyncBoundary = (0, react_1.forwardRef)(function ResetKeyCSROnlyAsyncBoundary(_a, resetRef) {
    var { pendingFallback, rejectedFallback, children, resetKeys } = _a, errorBoundaryProps = __rest(_a, ["pendingFallback", "rejectedFallback", "children", "resetKeys"]);
    const { resetKey } = (0, ResetKey_1.useResetKey)();
    const ref = (0, react_1.useRef)(null);
    (0, react_1.useImperativeHandle)(resetRef, () => ({ reset: () => { var _a; return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.resetErrorBoundary(); } }));
    return ((0, jsx_runtime_1.jsx)(_1.ErrorBoundary, Object.assign({}, errorBoundaryProps, { resetKeys: [resetKey, ...(resetKeys || [])], ref: ref, fallback: rejectedFallback }, { children: (0, jsx_runtime_1.jsx)(_1.Suspense.CSROnly, Object.assign({ fallback: pendingFallback }, { children: children })) })));
});
const ResetKeyAsyncBoundary = (0, react_1.forwardRef)(function ResetKeyAsyncBoundary(_a, resetRef) {
    var { pendingFallback, rejectedFallback, children, resetKeys } = _a, errorBoundaryProps = __rest(_a, ["pendingFallback", "rejectedFallback", "children", "resetKeys"]);
    const { resetKey } = (0, ResetKey_1.useResetKey)();
    const ref = (0, react_1.useRef)(null);
    (0, react_1.useImperativeHandle)(resetRef, () => ({ reset: () => { var _a; return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.resetErrorBoundary(); } }));
    return ((0, jsx_runtime_1.jsx)(_1.ErrorBoundary, Object.assign({}, errorBoundaryProps, { resetKeys: [resetKey, ...(resetKeys || [])], ref: ref, fallback: rejectedFallback }, { children: (0, jsx_runtime_1.jsx)(_1.Suspense.CSROnly, Object.assign({ fallback: pendingFallback }, { children: children })) })));
});
const CSROnlyAsyncBoundary = BaseCSROnlyAsyncBoundary;
CSROnlyAsyncBoundary.ResetKey = ResetKeyCSROnlyAsyncBoundary;
exports.AsyncBoundary = BaseAsyncBoundary;
exports.AsyncBoundary.CSROnly = CSROnlyAsyncBoundary;
exports.AsyncBoundary.ResetKey = ResetKeyAsyncBoundary;
//# sourceMappingURL=AsyncBoundary.js.map