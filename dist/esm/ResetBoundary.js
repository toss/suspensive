import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
import { useResetKey } from './hooks';
const initialState = {
    resetKey: 0,
    reset: () => { },
};
const ResetBoundary = createContext(initialState);
if (process.env.NODE_ENV !== 'production') {
    ResetBoundary.displayName = 'ResetBoundary';
}
export const ResetBoundaryProvider = ({ children }) => {
    const { resetKey, reset } = useResetKey();
    return _jsx(ResetBoundary.Provider, Object.assign({ value: { resetKey, reset } }, { children: children }));
};
export const ResetBoundaryConsumer = ResetBoundary.Consumer;
export const useResetBoundary = () => useContext(ResetBoundary);
export const withResetBoundary = (Component) => {
    const Wrapped = (props) => {
        return (_jsx(ResetBoundaryProvider, { children: _jsx(Component, Object.assign({}, props)) }));
    };
    return Wrapped;
};
//# sourceMappingURL=ResetBoundary.js.map