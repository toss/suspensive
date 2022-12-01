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
exports.QueryErrorBoundary = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@suspensive/react");
const react_query_1 = require("@tanstack/react-query");
exports.QueryErrorBoundary = (0, react_1.forwardRef)((_a, resetRef) => {
    var { onReset } = _a, props = __rest(_a, ["onReset"]);
    return ((0, jsx_runtime_1.jsx)(react_query_1.QueryErrorResetBoundary, { children: ({ reset }) => ((0, jsx_runtime_1.jsx)(react_2.ErrorBoundary, Object.assign({}, props, { onReset: () => {
                onReset === null || onReset === void 0 ? void 0 : onReset();
                reset();
            }, ref: resetRef }))) }));
});
//# sourceMappingURL=QueryErrorBoundary.js.map