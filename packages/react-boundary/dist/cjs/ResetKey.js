"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withResetKey = exports.useResetKey = exports.ResetKeyConsumer = exports.ResetKeyProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const hooks_1 = require("./hooks");
const ResetKeyContext = (0, react_1.createContext)({ resetKey: {}, reset: () => { } });
if (process.env.NODE_ENV !== 'production') {
    ResetKeyContext.displayName = 'ResetKeyContext';
}
const ResetKeyProvider = (props) => {
    const [resetKey, reset] = (0, hooks_1.useKey)();
    return (0, jsx_runtime_1.jsx)(ResetKeyContext.Provider, Object.assign({}, props, { value: { reset, resetKey } }));
};
exports.ResetKeyProvider = ResetKeyProvider;
exports.ResetKeyConsumer = ResetKeyContext.Consumer;
const useResetKey = () => (0, react_1.useContext)(ResetKeyContext);
exports.useResetKey = useResetKey;
const withResetKeyProviderConsumer = (Component) => (props) => ((0, jsx_runtime_1.jsx)(exports.ResetKeyProvider, { children: (0, jsx_runtime_1.jsx)(exports.ResetKeyConsumer, { children: ({ reset, resetKey }) => (0, jsx_runtime_1.jsx)(Component, Object.assign({ reset: reset, resetKey: resetKey }, props)) }) }));
const withResetKeyProvider = (Component) => (props) => ((0, jsx_runtime_1.jsx)(exports.ResetKeyProvider, { children: (0, jsx_runtime_1.jsx)(Component, Object.assign({}, props)) }));
const withResetKeyConsumer = (Component) => (props) => ((0, jsx_runtime_1.jsx)(exports.ResetKeyConsumer, { children: ({ reset, resetKey }) => (0, jsx_runtime_1.jsx)(Component, Object.assign({ reset: reset, resetKey: resetKey }, props)) }));
exports.withResetKey = withResetKeyProviderConsumer;
exports.withResetKey.Provider = withResetKeyProvider;
exports.withResetKey.Consumer = withResetKeyConsumer;
//# sourceMappingURL=ResetKey.js.map