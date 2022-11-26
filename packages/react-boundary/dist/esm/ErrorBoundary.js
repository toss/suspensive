var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx } from "react/jsx-runtime";
import { Component, forwardRef, isValidElement, useImperativeHandle, useRef, } from 'react';
import { useResetKey } from './ResetKey';
import { isDifferentArray } from './utils';
const initialState = {
    error: null,
};
export class BaseErrorBoundary extends Component {
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
export const ResetKeyErrorBoundary = forwardRef((_a, resetRef) => {
    var { resetKeys } = _a, rest = __rest(_a, ["resetKeys"]);
    const { resetKey } = useResetKey();
    const ref = useRef(null);
    useImperativeHandle(resetRef, () => ({ reset: () => { var _a; return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.resetErrorBoundary(); } }));
    return _jsx(BaseErrorBoundary, Object.assign({}, rest, { resetKeys: [resetKey, ...(resetKeys || [])] }));
});
export const ErrorBoundary = BaseErrorBoundary;
ErrorBoundary.ResetKey = ResetKeyErrorBoundary;
//# sourceMappingURL=ErrorBoundary.js.map