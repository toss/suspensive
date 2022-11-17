import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
import { useResetKey } from './hooks';
const defaultValue = {
    resetKey: -1,
    reset: () => { },
};
const ResetBoundary = createContext(defaultValue);
if (process.env.NODE_ENV !== 'production') {
    ResetBoundary.displayName = 'ResetBoundary';
}
export const ResetBoundaryProvider = ({ children }) => {
    const { resetKey, reset } = useResetKey();
    return _jsx(ResetBoundary.Provider, Object.assign({ value: { resetKey, reset } }, { children: children }));
};
export const ResetBoundaryConsumer = ResetBoundary.Consumer;
export const useResetBoundary = () => {
    const context = useContext(ResetBoundary);
    if (!context) {
        throw new Error('useResetBoundary error: Component using useResetBoundary require ResetBoundaryProvider as Parent');
    }
    return context;
};
export const withResetBoundary = (Component) => {
    const Wrapped = (props) => {
        return (_jsx(ResetBoundaryProvider, { children: _jsx(Component, Object.assign({}, props)) }));
    };
    return Wrapped;
};
//# sourceMappingURL=ResetBoundary.js.map