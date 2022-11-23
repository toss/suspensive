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
exports.QueryAsyncBoundary = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_boundary_1 = require("@suspensive/react-boundary");
const react_query_1 = require("@tanstack/react-query");
const BaseQueryAsyncBoundary = (0, react_1.forwardRef)(function BaseQueryAsyncBoundary(_a, resetRef) {
    var { onReset } = _a, props = __rest(_a, ["onReset"]);
    const { reset } = (0, react_query_1.useQueryErrorResetBoundary)();
    return ((0, jsx_runtime_1.jsx)(react_boundary_1.AsyncBoundary, Object.assign({}, props, { onReset: () => {
            reset();
            onReset === null || onReset === void 0 ? void 0 : onReset();
        }, ref: resetRef })));
});
const CSROnlyQueryAsyncBoundary = (0, react_1.forwardRef)(function CSROnlyQueryAsyncBoundary(_a, resetRef) {
    var { onReset, children } = _a, props = __rest(_a, ["onReset", "children"]);
    const { reset } = (0, react_query_1.useQueryErrorResetBoundary)();
    return ((0, jsx_runtime_1.jsx)(react_boundary_1.AsyncBoundary.CSROnly, Object.assign({}, props, { onReset: () => {
            reset();
            onReset === null || onReset === void 0 ? void 0 : onReset();
        }, ref: resetRef }, { children: children })));
});
exports.QueryAsyncBoundary = BaseQueryAsyncBoundary;
exports.QueryAsyncBoundary.CSROnly = CSROnlyQueryAsyncBoundary;
//# sourceMappingURL=QueryAsyncBoundary.js.map