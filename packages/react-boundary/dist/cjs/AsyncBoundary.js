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
const ErrorBoundary_1 = require("./ErrorBoundary");
const Suspense_1 = require("./Suspense");
const BaseAsyncBoundary = (0, react_1.forwardRef)((_a, resetRef) => {
    var { pendingFallback, rejectedFallback, children } = _a, errorBoundaryProps = __rest(_a, ["pendingFallback", "rejectedFallback", "children"]);
    return ((0, jsx_runtime_1.jsx)(ErrorBoundary_1.ErrorBoundary, Object.assign({}, errorBoundaryProps, { ref: resetRef, fallback: rejectedFallback }, { children: (0, jsx_runtime_1.jsx)(Suspense_1.Suspense, Object.assign({ fallback: pendingFallback }, { children: children })) })));
});
const CSROnlyAsyncBoundary = (0, react_1.forwardRef)((_a, resetRef) => {
    var { pendingFallback, rejectedFallback, children } = _a, errorBoundaryProps = __rest(_a, ["pendingFallback", "rejectedFallback", "children"]);
    return ((0, jsx_runtime_1.jsx)(ErrorBoundary_1.ErrorBoundary, Object.assign({}, errorBoundaryProps, { ref: resetRef, fallback: rejectedFallback }, { children: (0, jsx_runtime_1.jsx)(Suspense_1.Suspense.CSROnly, Object.assign({ fallback: pendingFallback }, { children: children })) })));
});
exports.AsyncBoundary = BaseAsyncBoundary;
exports.AsyncBoundary.CSROnly = CSROnlyAsyncBoundary;
//# sourceMappingURL=AsyncBoundary.js.map