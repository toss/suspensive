import { jsx as _jsx } from "react/jsx-runtime";
import { Component, forwardRef, isValidElement, useImperativeHandle, useRef, } from 'react';
import { useErrorBoundaryGroup } from './ErrorBoundaryGroup';
import { isDifferentArray } from './utils';
const initialState = {
    error: null,
};
class BaseErrorBoundary extends Component {
    constructor() {
        super(...arguments);
        this.state = initialState;
        this.resetErrorBoundary = () => {
            var _a, _b;
            (_b = (_a = this.props).onReset) === null || _b === void 0 ? void 0 : _b.call(_a);
            this.reset();
        };
    }
    static getDerivedStateFromError(error) {
        return { error };
    }
    reset() {
        this.setState(initialState);
    }
    componentDidCatch(error, info) {
        var _a, _b;
        (_b = (_a = this.props).onError) === null || _b === void 0 ? void 0 : _b.call(_a, error, info);
    }
    componentDidUpdate(prevProps, prevState) {
        const { error } = this.state;
        const { resetKeys } = this.props;
        if (error !== null && prevState.error !== null && isDifferentArray(prevProps.resetKeys, resetKeys)) {
            this.resetErrorBoundary();
        }
    }
    render() {
        const { error } = this.state;
        const { children, fallback } = this.props;
        if (error !== null) {
            if (isValidElement(fallback)) {
                return fallback;
            }
            if (typeof fallback === 'function') {
                return fallback({
                    error,
                    reset: this.resetErrorBoundary,
                });
            }
            throw new Error('react-error-boundary requires either a fallback');
        }
        return children;
    }
}
export const ErrorBoundary = forwardRef((props, resetRef) => {
    const { groupResetKey } = useErrorBoundaryGroup();
    const resetKeys = groupResetKey ? [groupResetKey, ...(props.resetKeys || [])] : props.resetKeys;
    const ref = useRef(null);
    useImperativeHandle(resetRef, () => ({ reset: () => { var _a; return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.resetErrorBoundary(); } }));
    return _jsx(BaseErrorBoundary, Object.assign({}, props, { resetKeys: resetKeys }));
});
//# sourceMappingURL=ErrorBoundary.js.map