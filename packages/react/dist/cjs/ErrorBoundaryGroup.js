"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withErrorBoundaryGroup = exports.useErrorBoundaryGroup = exports.ErrorBoundaryGroup = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const hooks_1 = require("./hooks");
const ErrorBoundaryGroupContext = (0, react_1.createContext)({ groupResetKey: {}, resetGroup: () => { } });
if (process.env.NODE_ENV !== 'production') {
    ErrorBoundaryGroupContext.displayName = 'ErrorBoundaryGroupContext';
}
const ErrorBoundaryGroupReset = ({ trigger }) => {
    const { resetGroup } = (0, exports.useErrorBoundaryGroup)();
    const Trigger = trigger;
    return (0, jsx_runtime_1.jsx)(Trigger, { resetGroup: resetGroup });
};
const ErrorBoundaryGroup = ({ blockOutside = false, children, }) => {
    const [resetKey, reset] = (0, hooks_1.useKey)();
    const isMounted = (0, hooks_1.useIsMounted)();
    const { groupResetKey } = (0, exports.useErrorBoundaryGroup)();
    (0, react_1.useEffect)(() => {
        if (isMounted && !blockOutside) {
            reset();
        }
    }, [groupResetKey, isMounted, reset]);
    return ((0, jsx_runtime_1.jsx)(ErrorBoundaryGroupContext.Provider, Object.assign({ value: { resetGroup: reset, groupResetKey: resetKey } }, { children: children })));
};
exports.ErrorBoundaryGroup = ErrorBoundaryGroup;
exports.ErrorBoundaryGroup.Reset = ErrorBoundaryGroupReset;
const useErrorBoundaryGroup = () => (0, react_1.useContext)(ErrorBoundaryGroupContext);
exports.useErrorBoundaryGroup = useErrorBoundaryGroup;
const withErrorBoundaryGroup = (Component) => (props) => ((0, jsx_runtime_1.jsx)(exports.ErrorBoundaryGroup, { children: (0, jsx_runtime_1.jsx)(Component, Object.assign({}, props)) }));
exports.withErrorBoundaryGroup = withErrorBoundaryGroup;
//# sourceMappingURL=ErrorBoundaryGroup.js.map