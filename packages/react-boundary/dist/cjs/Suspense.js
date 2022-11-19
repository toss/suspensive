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
exports.Suspense = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const components_1 = require("./components");
const react_1 = require("react");
const SelectableSuspense = (_a) => {
    var { ssrSafe = false } = _a, props = __rest(_a, ["ssrSafe"]);
    return ssrSafe ? (0, jsx_runtime_1.jsx)(components_1.SSRSafeSuspense, Object.assign({}, props)) : (0, jsx_runtime_1.jsx)(react_1.Suspense, Object.assign({}, props));
};
exports.Suspense = SelectableSuspense;
exports.Suspense.CSROnly = react_1.Suspense;
exports.Suspense.SSRSafe = components_1.SSRSafeSuspense;
//# sourceMappingURL=Suspense.js.map