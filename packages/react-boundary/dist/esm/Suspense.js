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
import { SSRSafeSuspense } from './components';
import { Suspense as BaseSuspense } from 'react';
const SelectableSuspense = (_a) => {
    var { ssrSafe = false } = _a, props = __rest(_a, ["ssrSafe"]);
    return ssrSafe ? _jsx(SSRSafeSuspense, Object.assign({}, props)) : _jsx(BaseSuspense, Object.assign({}, props));
};
export const Suspense = SelectableSuspense;
Suspense.CSROnly = BaseSuspense;
Suspense.SSRSafe = SSRSafeSuspense;
//# sourceMappingURL=Suspense.js.map