"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withResetBoundary = exports.ResetBoundary = exports.withResetBoundaryProvider = exports.useResetBoundary = exports.ResetBoundaryConsumer = exports.ResetBoundaryProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const hooks_1 = require("./hooks");
const defaultValue = {
    resetBoundaryKey: {},
    resetBoundary: () => { },
};
const ResetBoundaryContext = (0, react_1.createContext)(defaultValue);
if (process.env.NODE_ENV !== 'production') {
    ResetBoundaryContext.displayName = 'ResetBoundary';
}
const ResetBoundaryProvider = ({ children }) => {
    const { resetKey, reset } = (0, hooks_1.useResetKey)();
    return ((0, jsx_runtime_1.jsx)(ResetBoundaryContext.Provider, Object.assign({ value: { resetBoundaryKey: resetKey, resetBoundary: reset } }, { children: children })));
};
exports.ResetBoundaryProvider = ResetBoundaryProvider;
exports.ResetBoundaryConsumer = ResetBoundaryContext.Consumer;
const useResetBoundary = () => {
    const context = (0, react_1.useContext)(ResetBoundaryContext);
    if (!context) {
        throw new Error('useResetBoundary error: Component using useResetBoundary require ResetBoundaryProvider as Parent');
    }
    return context;
};
exports.useResetBoundary = useResetBoundary;
const withResetBoundaryProvider = (Component) => {
    const WrappedByResetBoundaryProvider = (props) => ((0, jsx_runtime_1.jsx)(exports.ResetBoundaryProvider, { children: (0, jsx_runtime_1.jsx)(Component, Object.assign({}, props)) }));
    return WrappedByResetBoundaryProvider;
};
exports.withResetBoundaryProvider = withResetBoundaryProvider;
const ResetBoundary = ({ children }) => ((0, jsx_runtime_1.jsx)(exports.ResetBoundaryProvider, { children: (0, jsx_runtime_1.jsx)(exports.ResetBoundaryConsumer, { children: children }) }));
exports.ResetBoundary = ResetBoundary;
const withResetBoundary = (Component) => {
    const WrappedComponent = props => ((0, jsx_runtime_1.jsx)(exports.ResetBoundary, { children: ({ resetBoundary, resetBoundaryKey }) => ((0, jsx_runtime_1.jsx)(Component, Object.assign({ resetBoundary: resetBoundary, resetBoundaryKey: resetBoundaryKey }, props))) }));
    return WrappedComponent;
};
exports.withResetBoundary = withResetBoundary;
//# sourceMappingURL=ResetBoundary.js.map