import { Component, isValidElement } from 'react';
import { isDifferentArray } from './utils';
const initialState = {
    error: null,
};
export class ErrorBoundary extends Component {
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
        if (error !== null &&
            prevState.error !== null &&
            isDifferentArray(prevProps.resetKeys, resetKeys)) {
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
            else if (typeof fallback === 'function') {
                return fallback({
                    error,
                    reset: this.resetErrorBoundary,
                });
            }
            else {
                throw new Error('react-error-boundary requires either a fallback');
            }
        }
        return children;
    }
}
//# sourceMappingURL=ErrorBoundary.js.map