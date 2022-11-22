import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, } from 'react';
import { useResetKey } from './hooks';
const defaultValue = {
    resetBoundaryKey: {},
    resetBoundary: () => { },
};
const ResetBoundaryContext = createContext(defaultValue);
if (process.env.NODE_ENV !== 'production') {
    ResetBoundaryContext.displayName = 'ResetBoundary';
}
export const ResetBoundaryProvider = ({ children }) => {
    const { resetKey, reset } = useResetKey();
    return (_jsx(ResetBoundaryContext.Provider, Object.assign({ value: { resetBoundaryKey: resetKey, resetBoundary: reset } }, { children: children })));
};
export const ResetBoundaryConsumer = ResetBoundaryContext.Consumer;
export const useResetBoundary = () => {
    const context = useContext(ResetBoundaryContext);
    if (!context) {
        throw new Error('useResetBoundary error: Component using useResetBoundary require ResetBoundaryProvider as Parent');
    }
    return context;
};
export const withResetBoundaryProvider = (Component) => {
    const WrappedByResetBoundaryProvider = (props) => (_jsx(ResetBoundaryProvider, { children: _jsx(Component, Object.assign({}, props)) }));
    return WrappedByResetBoundaryProvider;
};
export const ResetBoundary = ({ children }) => (_jsx(ResetBoundaryProvider, { children: _jsx(ResetBoundaryConsumer, { children: children }) }));
export const withResetBoundary = (Component) => {
    const WrappedComponent = (props) => (_jsx(ResetBoundary, { children: ({ resetBoundary, resetBoundaryKey }) => (_jsx(Component, Object.assign({ resetBoundary: resetBoundary, resetBoundaryKey: resetBoundaryKey }, props))) }));
    return WrappedComponent;
};
//# sourceMappingURL=ResetBoundary.js.map