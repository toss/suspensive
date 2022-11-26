"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorBoundary = exports.ResetKeyErrorBoundary = exports.BaseErrorBoundary = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ResetKey_1 = require("./ResetKey");
const utils_1 = require("./utils");
const initialState = {
    error: null,
};
class BaseErrorBoundary extends react_1.Component {
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
        if (error !== null && prevState.error !== null && (0, utils_1.isDifferentArray)(prevProps.resetKeys, resetKeys)) {
            this.resetErrorBoundary();
        }
    }
    render() {
        const { error } = this.state;
        const { children, fallback } = this.props;
        if (error !== null) {
            if ((0, react_1.isValidElement)(fallback)) {
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
exports.BaseErrorBoundary = BaseErrorBoundary;
exports.ResetKeyErrorBoundary = (0, react_1.forwardRef)((_a, resetRef) => {
    var { resetKeys } = _a, rest = __rest(_a, ["resetKeys"]);
    const { resetKey } = (0, ResetKey_1.useResetKey)();
    const ref = (0, react_1.useRef)(null);
    (0, react_1.useImperativeHandle)(resetRef, () => ({ reset: () => { var _a; return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.resetErrorBoundary(); } }));
    return (0, jsx_runtime_1.jsx)(BaseErrorBoundary, Object.assign({}, rest, { resetKeys: [resetKey, ...(resetKeys || [])] }));
});
exports.ErrorBoundary = BaseErrorBoundary;
exports.ErrorBoundary.ResetKey = exports.ResetKeyErrorBoundary;
//# sourceMappingURL=ErrorBoundary.js.map