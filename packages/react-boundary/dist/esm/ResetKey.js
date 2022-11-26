import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
import { useKey } from './hooks';
const ResetKeyContext = createContext({ resetKey: {}, reset: () => { } });
if (process.env.NODE_ENV !== 'production') {
    ResetKeyContext.displayName = 'ResetKeyContext';
}
const ResetKeyProvider = (props) => {
    const [resetKey, reset] = useKey();
    return _jsx(ResetKeyContext.Provider, Object.assign({}, props, { value: { reset, resetKey } }));
};
const ResetKeyConsumer = ResetKeyContext.Consumer;
const BaseResetKey = (props) => (_jsx(ResetKeyProvider, { children: _jsx(ResetKeyConsumer, Object.assign({}, props)) }));
export const ResetKey = BaseResetKey;
ResetKey.Provider = ResetKeyProvider;
ResetKey.Consumer = ResetKeyConsumer;
export const useResetKey = () => useContext(ResetKeyContext);
const withResetKeyProviderConsumer = (Component) => (props) => (_jsx(ResetKeyProvider, { children: _jsx(ResetKeyConsumer, { children: ({ reset, resetKey }) => _jsx(Component, Object.assign({ reset: reset, resetKey: resetKey }, props)) }) }));
const withResetKeyProvider = (Component) => (props) => (_jsx(ResetKeyProvider, { children: _jsx(Component, Object.assign({}, props)) }));
const withResetKeyConsumer = (Component) => (props) => (_jsx(ResetKeyConsumer, { children: ({ reset, resetKey }) => _jsx(Component, Object.assign({ reset: reset, resetKey: resetKey }, props)) }));
export const withResetKey = withResetKeyProviderConsumer;
withResetKey.Provider = withResetKeyProvider;
withResetKey.Consumer = withResetKeyConsumer;
//# sourceMappingURL=ResetKey.js.map