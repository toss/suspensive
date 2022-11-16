"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
function useResetKey() {
    const [resetKey, setResetKey] = (0, react_1.useState)(0);
    const reset = (0, react_1.useCallback)(() => setResetKey(prev => prev + 1), []);
    return { resetKey, reset };
}
exports.default = useResetKey;
//# sourceMappingURL=useResetKey.js.map