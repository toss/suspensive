"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useResetKey = () => {
    const [resetKey, setResetKey] = (0, react_1.useState)({});
    const reset = (0, react_1.useCallback)(() => setResetKey((prev) => (Object.assign({}, prev))), []);
    return { resetKey, reset };
};
exports.default = useResetKey;
//# sourceMappingURL=useResetKey.js.map