"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useIsMounted = () => {
    const [isMounted, setIsMounted] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setIsMounted(true);
    }, []);
    return isMounted;
};
exports.default = useIsMounted;
//# sourceMappingURL=useIsMounted.js.map