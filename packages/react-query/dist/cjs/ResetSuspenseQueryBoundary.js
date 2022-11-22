"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetSuspenseQueryBoundary = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const react_boundary_1 = require("@suspensive/react-boundary");
const BaseResetSuspenseQueryBoundary = (0, react_1.forwardRef)(function BaseResetSuspenseQueryBoundary(props, resetRef) {
    return ((0, jsx_runtime_1.jsx)(react_query_1.QueryErrorResetBoundary, { children: ({ reset }) => (0, jsx_runtime_1.jsx)(react_boundary_1.AsyncBoundary, Object.assign({ ref: resetRef }, props, { onReset: reset })) }));
});
const CSROnlyResetSuspenseQueryBoundary = (0, react_1.forwardRef)(function CSROnlyResetSuspenseQueryBoundary(props, resetRef) {
    return ((0, jsx_runtime_1.jsx)(react_query_1.QueryErrorResetBoundary, { children: ({ reset }) => ((0, jsx_runtime_1.jsx)(react_boundary_1.AsyncBoundary.CSROnly, Object.assign({ ref: resetRef }, props, { onReset: reset }))) }));
});
exports.ResetSuspenseQueryBoundary = BaseResetSuspenseQueryBoundary;
exports.ResetSuspenseQueryBoundary.CSROnly = CSROnlyResetSuspenseQueryBoundary;
//# sourceMappingURL=ResetSuspenseQueryBoundary.js.map