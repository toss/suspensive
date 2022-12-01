import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect } from 'react';
import { useIsMounted, useKey } from './hooks';
const ErrorBoundaryGroupContext = createContext({ groupResetKey: {}, resetGroup: () => { } });
if (process.env.NODE_ENV !== 'production') {
    ErrorBoundaryGroupContext.displayName = 'ErrorBoundaryGroupContext';
}
const ErrorBoundaryGroupReset = ({ trigger }) => {
    const { resetGroup } = useErrorBoundaryGroup();
    const Trigger = trigger;
    return _jsx(Trigger, { resetGroup: resetGroup });
};
export const ErrorBoundaryGroup = ({ blockOutside = false, children, }) => {
    const [resetKey, reset] = useKey();
    const isMounted = useIsMounted();
    const { groupResetKey } = useErrorBoundaryGroup();
    useEffect(() => {
        if (isMounted && !blockOutside) {
            reset();
        }
    }, [groupResetKey, isMounted, reset]);
    return (_jsx(ErrorBoundaryGroupContext.Provider, Object.assign({ value: { resetGroup: reset, groupResetKey: resetKey } }, { children: children })));
};
ErrorBoundaryGroup.Reset = ErrorBoundaryGroupReset;
export const useErrorBoundaryGroup = () => useContext(ErrorBoundaryGroupContext);
export const withErrorBoundaryGroup = (Component) => (props) => (_jsx(ErrorBoundaryGroup, { children: _jsx(Component, Object.assign({}, props)) }));
//# sourceMappingURL=ErrorBoundaryGroup.js.map