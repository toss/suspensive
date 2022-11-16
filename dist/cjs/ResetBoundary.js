"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withResetBoundary = exports.useResetBoundary = exports.ResetBoundaryConsumer = exports.ResetBoundaryProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const hooks_1 = require("./hooks");
const initialState = {
    resetKey: 0,
    reset: () => { },
};
const ResetBoundary = (0, react_1.createContext)(initialState);
if (process.env.NODE_ENV !== 'production') {
    ResetBoundary.displayName = 'ResetBoundary';
}
const ResetBoundaryProvider = ({ children }) => {
    const { resetKey, reset } = (0, hooks_1.useResetKey)();
    return (0, jsx_runtime_1.jsx)(ResetBoundary.Provider, Object.assign({ value: { resetKey, reset } }, { children: children }));
};
exports.ResetBoundaryProvider = ResetBoundaryProvider;
exports.ResetBoundaryConsumer = ResetBoundary.Consumer;
const useResetBoundary = () => (0, react_1.useContext)(ResetBoundary);
exports.useResetBoundary = useResetBoundary;
const withResetBoundary = (Component) => {
    const Wrapped = (props) => {
        return ((0, jsx_runtime_1.jsx)(exports.ResetBoundaryProvider, { children: (0, jsx_runtime_1.jsx)(Component, Object.assign({}, props)) }));
    };
    return Wrapped;
};
exports.withResetBoundary = withResetBoundary;
//# sourceMappingURL=ResetBoundary.js.map