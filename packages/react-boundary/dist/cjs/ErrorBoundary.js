"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorBoundary = void 0;
const react_1 = require("react");
const utils_1 = require("./utils");
const initialState = {
    error: null,
};
class ErrorBoundary extends react_1.Component {
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
exports.ErrorBoundary = ErrorBoundary;
//# sourceMappingURL=ErrorBoundary.js.map