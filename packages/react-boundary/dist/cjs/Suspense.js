"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Suspense = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const components_1 = require("./components");
const react_1 = require("react");
const DefaultSuspense = (props) => (0, jsx_runtime_1.jsx)(react_1.Suspense, Object.assign({}, props));
exports.Suspense = DefaultSuspense;
exports.Suspense.CSROnly = components_1.CSROnlySuspense;
//# sourceMappingURL=Suspense.js.map