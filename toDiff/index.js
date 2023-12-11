"use client"
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};

// src/SuspensiveProvider.tsx
import { useMemo } from "react";

// src/Delay.tsx
import { createContext, useContext, useState as useState2 } from "react";

// src/hooks/useIsChanged.ts
var useIsChanged = (value) => usePrevious(value) !== value;

// src/hooks/useIsClient.ts
import { useState } from "react";

// src/hooks/useIsomorphicLayoutEffect.ts
import { useEffect, useLayoutEffect } from "react";
var useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// src/hooks/useIsClient.ts
var useIsClient = () => {
  const [isClient, setIsClient] = useState(false);
  useIsomorphicLayoutEffect(() => {
    setIsClient(true);
  }, []);
  return isClient;
};

// src/hooks/usePrevious.ts
import { useEffect as useEffect2, useRef } from "react";
var usePrevious = (value) => {
  const ref = useRef(value);
  useEffect2(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

// src/hooks/useTimeout.ts
import { useEffect as useEffect3, useRef as useRef2 } from "react";
var useTimeout = (fn, ms) => {
  const fnRef = useRef2(fn);
  useIsomorphicLayoutEffect(() => {
    fnRef.current = fn;
  }, [fn]);
  useEffect3(() => {
    const id = setTimeout(fnRef.current, ms);
    return () => clearTimeout(id);
  }, [ms]);
};

// src/wrap.tsx
import { jsx } from "react/jsx-runtime";
var WrapWithoutCSROnly = class {
  constructor(wrappers) {
    this.wrappers = wrappers;
    this.Suspense = (props = {}) => {
      this.wrappers.unshift([Suspense, props]);
      return this;
    };
    this.ErrorBoundary = (props) => {
      this.wrappers.unshift([ErrorBoundary, props]);
      return this;
    };
    this.ErrorBoundaryGroup = (props = {}) => {
      this.wrappers.unshift([ErrorBoundaryGroup, props]);
      return this;
    };
    this.Delay = (props = {}) => {
      this.wrappers.unshift([Delay, props]);
      return this;
    };
    this.on = (Component2) => {
      const WrappedComponent = (props) => this.wrappers.reduce(
        (acc, [WrapperComponent, wrapperProps]) => /* @__PURE__ */ jsx(WrapperComponent, __spreadProps(__spreadValues({}, wrapperProps), { children: acc })),
        /* @__PURE__ */ jsx(Component2, __spreadValues({}, props))
      );
      if (process.env.NODE_ENV !== "production") {
        WrappedComponent.displayName = this.wrappers.reduce(
          (acc, [WrapperComponent]) => `with${WrapperComponent.displayName}(${acc})`,
          Component2.displayName || Component2.name || "Component"
        );
      }
      return WrappedComponent;
    };
  }
};
var createWrap = () => {
  const wrappers = [];
  const wrap2 = new WrapWithoutCSROnly(wrappers);
  wrap2.Suspense.CSROnly = (props = {}) => {
    wrappers.unshift([Suspense.CSROnly, props]);
    return wrap2;
  };
  return wrap2;
};
var wrapSuspense = (props = {}) => createWrap().Suspense(props);
wrapSuspense.CSROnly = (props = {}) => createWrap().Suspense.CSROnly(props);
var wrapErrorBoundary = (props) => createWrap().ErrorBoundary(props);
var wrapErrorBoundaryGroup = (props) => createWrap().ErrorBoundaryGroup(props);
var wrapDelay = (props = {}) => createWrap().Delay(props);
var wrap = {
  Suspense: wrapSuspense,
  ErrorBoundary: wrapErrorBoundary,
  ErrorBoundaryGroup: wrapErrorBoundaryGroup,
  Delay: wrapDelay
};

// src/Delay.tsx
import { Fragment, jsx as jsx2 } from "react/jsx-runtime";
var Delay = ({ ms, children }) => {
  var _a;
  const delayContextValue = useContext(DelayContext);
  const delayMs = (_a = ms != null ? ms : delayContextValue.ms) != null ? _a : 0;
  const [isDelayed, setIsDelayed] = useState2(delayMs === 0);
  useTimeout(() => setIsDelayed(true), delayMs);
  return /* @__PURE__ */ jsx2(Fragment, { children: isDelayed ? children : null });
};
if (process.env.NODE_ENV !== "production") {
  Delay.displayName = "Delay";
}
var DelayContext = createContext({ ms: 0 });
var withDelay = (component, delayProps = {}) => wrap.Delay(delayProps).on(component);

// src/Suspense.tsx
import { Suspense as ReactSuspense, createContext as createContext2, useContext as useContext2 } from "react";
import { Fragment as Fragment2, jsx as jsx3 } from "react/jsx-runtime";
var SuspenseContext = createContext2({ fallback: void 0 });
var useFallbackWithContext = (fallback) => {
  const contextFallback = useContext2(SuspenseContext).fallback;
  return fallback === null ? null : fallback != null ? fallback : contextFallback;
};
var DefaultSuspense = (props) => {
  const fallback = useFallbackWithContext(props.fallback);
  return /* @__PURE__ */ jsx3(ReactSuspense, __spreadProps(__spreadValues({}, props), { fallback }));
};
if (process.env.NODE_ENV !== "production") {
  DefaultSuspense.displayName = "Suspense";
}
var CSROnly = (props) => {
  const isClient = useIsClient();
  const fallback = useFallbackWithContext(props.fallback);
  return isClient ? /* @__PURE__ */ jsx3(ReactSuspense, __spreadProps(__spreadValues({}, props), { fallback })) : /* @__PURE__ */ jsx3(Fragment2, { children: fallback });
};
if (process.env.NODE_ENV !== "production") {
  CSROnly.displayName = "Suspense.CSROnly";
}
var Suspense = Object.assign(DefaultSuspense, {
  /**
   * CSROnly make Suspense can be used in SSR framework like Next.js with React 17 or under
   * @see {@link https://suspensive.org/docs/react/Suspense}
   */
  CSROnly
});
var withSuspense = Object.assign(
  (component, suspenseProps = {}) => wrap.Suspense(suspenseProps).on(component),
  {
    /**
     * @deprecated Use wrap.Suspense.CSROnly().on as alternatives
     */
    CSROnly: (component, suspenseProps = {}) => wrap.Suspense.CSROnly(suspenseProps).on(component)
  }
);

// src/SuspensiveProvider.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
var Suspensive = class {
  constructor(config = {}) {
    this.defaultOptions = config.defaultOptions;
  }
};
var SuspensiveProvider = ({ value, children }) => {
  var _a, _b;
  const delayValue = useMemo(() => {
    var _a2;
    return ((_a2 = value.defaultOptions) == null ? void 0 : _a2.delay) || {};
  }, [(_a = value.defaultOptions) == null ? void 0 : _a.delay]);
  const suspenseValue = useMemo(() => {
    var _a2;
    return ((_a2 = value.defaultOptions) == null ? void 0 : _a2.suspense) || {};
  }, [(_b = value.defaultOptions) == null ? void 0 : _b.suspense]);
  return /* @__PURE__ */ jsx4(DelayContext.Provider, { value: delayValue, children: /* @__PURE__ */ jsx4(SuspenseContext.Provider, { value: suspenseValue, children }) });
};

// src/ErrorBoundary.tsx
import { Component, createContext as createContext4, forwardRef, useContext as useContext4, useImperativeHandle, useMemo as useMemo3, useRef as useRef3, useState as useState3 } from "react";

// src/ErrorBoundaryGroup.tsx
import { createContext as createContext3, useContext as useContext3, useEffect as useEffect4, useMemo as useMemo2, useReducer } from "react";

// src/utils/assert.ts
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
assert.message = {
  useErrorBoundary: {
    onlyInChildrenOfErrorBoundary: "useErrorBoundary: this hook should be called in ErrorBoundary.props.children"
  },
  useErrorBoundaryFallbackProps: {
    onlyInFallbackOfErrorBoundary: "useErrorBoundaryFallbackProps: this hook should be called in ErrorBoundary.props.fallback"
  },
  useErrorBoundaryGroup: {
    onlyInChildrenOfErrorBoundaryGroup: "useErrorBoundaryGroup: this hook should be called in ErrorBoundaryGroup.props.children"
  }
};

// src/utils/hasResetKeysChanged.ts
var hasResetKeysChanged = (a = [], b = []) => a.length !== b.length || a.some((item, index) => !Object.is(item, b[index]));

// src/ErrorBoundaryGroup.tsx
import { jsx as jsx5 } from "react/jsx-runtime";
var ErrorBoundaryGroupContext = createContext3(void 0);
if (process.env.NODE_ENV !== "production") {
  ErrorBoundaryGroupContext.displayName = "ErrorBoundaryGroupContext";
}
var increase = (prev) => prev + 1;
var ErrorBoundaryGroup = ({ blockOutside = false, children }) => {
  const [resetKey, reset] = useReducer(increase, 0);
  const parentGroup = useContext3(ErrorBoundaryGroupContext);
  const isParentGroupResetKeyChanged = useIsChanged(parentGroup == null ? void 0 : parentGroup.resetKey);
  useEffect4(() => {
    if (!blockOutside && isParentGroupResetKeyChanged) {
      reset();
    }
  }, [isParentGroupResetKeyChanged, blockOutside]);
  const value = useMemo2(() => ({ reset, resetKey }), [resetKey]);
  return /* @__PURE__ */ jsx5(ErrorBoundaryGroupContext.Provider, { value, children });
};
if (process.env.NODE_ENV !== "production") {
  ErrorBoundaryGroup.displayName = "ErrorBoundaryGroup";
}
var ErrorBoundaryGroupReset = ({
  trigger: Trigger
}) => {
  const errorBoundaryGroup = useErrorBoundaryGroup();
  return /* @__PURE__ */ jsx5(Trigger, { reset: errorBoundaryGroup.reset });
};
ErrorBoundaryGroup.Reset = ErrorBoundaryGroupReset;
var useErrorBoundaryGroup = () => {
  const group = useContext3(ErrorBoundaryGroupContext);
  assert(group != null, assert.message.useErrorBoundaryGroup.onlyInChildrenOfErrorBoundaryGroup);
  return useMemo2(
    () => ({
      /**
       * When you want to reset multiple ErrorBoundaries as children of ErrorBoundaryGroup, You can use this reset
       */
      reset: group.reset
    }),
    [group.reset]
  );
};
var withErrorBoundaryGroup = (component, errorBoundaryGroupProps = {}) => wrap.ErrorBoundaryGroup(errorBoundaryGroupProps).on(component);

// src/ErrorBoundary.tsx
import { jsx as jsx6 } from "react/jsx-runtime";
var initialErrorBoundaryState = {
  isError: false,
  error: null
};
var BaseErrorBoundary = class extends Component {
  constructor() {
    super(...arguments);
    this.state = initialErrorBoundaryState;
    this.reset = () => {
      var _a, _b;
      (_b = (_a = this.props).onReset) == null ? void 0 : _b.call(_a);
      this.setState(initialErrorBoundaryState);
    };
  }
  static getDerivedStateFromError(error) {
    return { isError: true, error };
  }
  componentDidUpdate(prevProps, prevState) {
    const { isError } = this.state;
    const { resetKeys } = this.props;
    if (isError && prevState.isError && hasResetKeysChanged(prevProps.resetKeys, resetKeys)) {
      this.reset();
    }
  }
  componentDidCatch(error, info) {
    var _a, _b;
    (_b = (_a = this.props).onError) == null ? void 0 : _b.call(_a, error, info);
  }
  render() {
    const { children, fallback } = this.props;
    if (this.state.isError && typeof fallback === "undefined") {
      if (process.env.NODE_ENV !== "production") {
        console.error("ErrorBoundary of @suspensive/react requires a defined fallback");
      }
      throw this.state.error;
    }
    let childrenOrFallback = children;
    if (this.state.isError) {
      if (typeof fallback === "function") {
        const FallbackComponent = fallback;
        childrenOrFallback = /* @__PURE__ */ jsx6(FallbackComponent, { error: this.state.error, reset: this.reset });
      } else {
        childrenOrFallback = fallback;
      }
    }
    return /* @__PURE__ */ jsx6(ErrorBoundaryContext.Provider, { value: __spreadProps(__spreadValues({}, this.state), { reset: this.reset }), children: childrenOrFallback });
  }
};
var ErrorBoundary = forwardRef((props, ref) => {
  var _a;
  const group = (_a = useContext4(ErrorBoundaryGroupContext)) != null ? _a : { resetKey: 0 };
  const resetKeys = [group.resetKey, ...props.resetKeys || []];
  const baseErrorBoundaryRef = useRef3(null);
  useImperativeHandle(ref, () => ({
    reset: () => {
      var _a2;
      return (_a2 = baseErrorBoundaryRef.current) == null ? void 0 : _a2.reset();
    }
  }));
  return /* @__PURE__ */ jsx6(BaseErrorBoundary, __spreadProps(__spreadValues({}, props), { resetKeys, ref: baseErrorBoundaryRef }));
});
if (process.env.NODE_ENV !== "production") {
  ErrorBoundary.displayName = "ErrorBoundary";
}
var withErrorBoundary = (component, errorBoundaryProps) => wrap.ErrorBoundary(errorBoundaryProps).on(component);
var ErrorBoundaryContext = createContext4(null);
var useErrorBoundary = () => {
  const [state, setState] = useState3({
    isError: false,
    error: null
  });
  if (state.isError) {
    throw state.error;
  }
  const errorBoundary = useContext4(ErrorBoundaryContext);
  assert(errorBoundary != null && !errorBoundary.isError, assert.message.useErrorBoundary.onlyInChildrenOfErrorBoundary);
  return useMemo3(
    () => ({
      setError: (error) => setState({ isError: true, error })
    }),
    []
  );
};
var useErrorBoundaryFallbackProps = () => {
  const errorBoundary = useContext4(ErrorBoundaryContext);
  assert(
    errorBoundary != null && errorBoundary.isError,
    assert.message.useErrorBoundaryFallbackProps.onlyInFallbackOfErrorBoundary
  );
  return useMemo3(
    () => ({
      error: errorBoundary.error,
      reset: errorBoundary.reset
    }),
    [errorBoundary.error, errorBoundary.reset]
  );
};

// src/AsyncBoundary.tsx
import { forwardRef as forwardRef2 } from "react";
import { jsx as jsx7 } from "react/jsx-runtime";
var BaseAsyncBoundary = forwardRef2(
  (_a, resetRef) => {
    var _b = _a, { pendingFallback, rejectedFallback, children } = _b, errorBoundaryProps = __objRest(_b, ["pendingFallback", "rejectedFallback", "children"]);
    return /* @__PURE__ */ jsx7(ErrorBoundary, __spreadProps(__spreadValues({}, errorBoundaryProps), { ref: resetRef, fallback: rejectedFallback, children: /* @__PURE__ */ jsx7(Suspense, { fallback: pendingFallback, children }) }));
  }
);
if (process.env.NODE_ENV !== "production") {
  BaseAsyncBoundary.displayName = "AsyncBoundary";
}
var CSROnly2 = forwardRef2(
  (_a, resetRef) => {
    var _b = _a, { pendingFallback, rejectedFallback, children } = _b, errorBoundaryProps = __objRest(_b, ["pendingFallback", "rejectedFallback", "children"]);
    return /* @__PURE__ */ jsx7(ErrorBoundary, __spreadProps(__spreadValues({}, errorBoundaryProps), { ref: resetRef, fallback: rejectedFallback, children: /* @__PURE__ */ jsx7(Suspense.CSROnly, { fallback: pendingFallback, children }) }));
  }
);
if (process.env.NODE_ENV !== "production") {
  CSROnly2.displayName = "AsyncBoundary.CSROnly";
}
var AsyncBoundary = Object.assign(BaseAsyncBoundary, {
  /**
   * @deprecated Use `<Suspense/>` and `<ErrorBoundary/>` as alternatives
   */
  CSROnly: CSROnly2
});
var withAsyncBoundary = Object.assign(
  (Component2, asyncBoundaryProps) => {
    const Wrapped = (props) => /* @__PURE__ */ jsx7(AsyncBoundary, __spreadProps(__spreadValues({}, asyncBoundaryProps), { children: /* @__PURE__ */ jsx7(Component2, __spreadValues({}, props)) }));
    if (process.env.NODE_ENV !== "production") {
      const name = Component2.displayName || Component2.name || "Component";
      Wrapped.displayName = `withAsyncBoundary(${name})`;
    }
    return Wrapped;
  },
  {
    /**
     * @deprecated Use wrap.ErrorBoundary().Suspense.CSROnly().on as alternatives
     */
    CSROnly: (Component2, asyncBoundaryProps) => {
      const Wrapped = (props) => /* @__PURE__ */ jsx7(AsyncBoundary.CSROnly, __spreadProps(__spreadValues({}, asyncBoundaryProps), { children: /* @__PURE__ */ jsx7(Component2, __spreadValues({}, props)) }));
      if (process.env.NODE_ENV !== "production") {
        const name = Component2.displayName || Component2.name || "Component";
        Wrapped.displayName = `withAsyncBoundary.CSROnly(${name})`;
      }
      return Wrapped;
    }
  }
);
export {
  AsyncBoundary,
  Delay,
  ErrorBoundary,
  ErrorBoundaryGroup,
  Suspense,
  Suspensive,
  SuspensiveProvider,
  useErrorBoundary,
  useErrorBoundaryFallbackProps,
  useErrorBoundaryGroup,
  withAsyncBoundary,
  withDelay,
  withErrorBoundary,
  withErrorBoundaryGroup,
  withSuspense,
  wrap
};
//# sourceMappingURL=index.js.map