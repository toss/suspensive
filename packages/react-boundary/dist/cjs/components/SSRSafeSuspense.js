"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSRSafeSuspense = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const hooks_1 = require("../hooks");
const SSRSafeSuspense = props => {
    const isMounted = (0, hooks_1.useIsMounted)();
    return isMounted ? (0, jsx_runtime_1.jsx)(react_1.Suspense, Object.assign({}, props)) : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: props.fallback });
};
exports.SSRSafeSuspense = SSRSafeSuspense;
//# sourceMappingURL=SSRSafeSuspense.js.map