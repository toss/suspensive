"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useKey = () => {
    const [key, setKey] = (0, react_1.useState)(0);
    const refresh = (0, react_1.useCallback)(() => setKey((prev) => prev + 1), []);
    return [key, refresh];
};
exports.default = useKey;
//# sourceMappingURL=useKey.js.map