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

// src/Suspense.tsx
import { Suspense as ReactSuspense, createContext as createContext4, useContext as useContext4 } from "react";

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

// src/Delay.tsx
import { createContext, useContext, useState as useState2 } from "react";
import { Fragment, jsx } from "react/jsx-runtime";
var Delay = ({ ms, children }) => {
  var _a;
  const delayContextValue = useContext(DelayContext);
  const delayMs = (_a = ms != null ? ms : delayContextValue.ms) != null ? _a : 0;
  const [isDelayed, setIsDelayed] = useState2(delayMs === 0);
  useTimeout(() => setIsDelayed(true), delayMs);
  return /* @__PURE__ */ jsx(Fragment, { children: isDelayed ? children : null });
};
if (process.env.NODE_ENV !== "production") {
  Delay.displayName = "Delay";
}
var DelayContext = createContext({ ms: 0 });

// src/ErrorBoundary.tsx
import { Component, createContext as createContext3, forwardRef, useContext as useContext3, useImperativeHandle, useMemo as useMemo2, useRef as useRef3, useState as useState3 } from "react";

// src/ErrorBoundaryGroup.tsx
import { createContext as createContext2, useContext as useContext2, useEffect as useEffect4, useMemo, useReducer } from "react";

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
import { jsx as jsx2 } from "react/jsx-runtime";
var ErrorBoundaryGroupContext = createContext2(void 0);
if (process.env.NODE_ENV !== "production") {
  ErrorBoundaryGroupContext.displayName = "ErrorBoundaryGroupContext";
}
var increase = (prev) => prev + 1;
var ErrorBoundaryGroup = ({ blockOutside = false, children }) => {
  const [resetKey, reset] = useReducer(increase, 0);
  const parentGroup = useContext2(ErrorBoundaryGroupContext);
  const isParentGroupResetKeyChanged = useIsChanged(parentGroup == null ? void 0 : parentGroup.resetKey);
  useEffect4(() => {
    if (!blockOutside && isParentGroupResetKeyChanged) {
      reset();
    }
  }, [isParentGroupResetKeyChanged, blockOutside]);
  const value = useMemo(() => ({ reset, resetKey }), [resetKey]);
  return /* @__PURE__ */ jsx2(ErrorBoundaryGroupContext.Provider, { value, children });
};
if (process.env.NODE_ENV !== "production") {
  ErrorBoundaryGroup.displayName = "ErrorBoundaryGroup";
}
var ErrorBoundaryGroupReset = ({
  trigger: Trigger
}) => {
  const errorBoundaryGroup = useErrorBoundaryGroup();
  return /* @__PURE__ */ jsx2(Trigger, { reset: errorBoundaryGroup.reset });
};
ErrorBoundaryGroup.Reset = ErrorBoundaryGroupReset;
var useErrorBoundaryGroup = () => {
  const group = useContext2(ErrorBoundaryGroupContext);
  assert(group != null, assert.message.useErrorBoundaryGroup.onlyInChildrenOfErrorBoundaryGroup);
  return useMemo(
    () => ({
      /**
       * When you want to reset multiple ErrorBoundaries as children of ErrorBoundaryGroup, You can use this reset
       */
      reset: group.reset
    }),
    [group.reset]
  );
};

// src/ErrorBoundary.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
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
        childrenOrFallback = /* @__PURE__ */ jsx3(FallbackComponent, { error: this.state.error, reset: this.reset });
      } else {
        childrenOrFallback = fallback;
      }
    }
    return /* @__PURE__ */ jsx3(ErrorBoundaryContext.Provider, { value: __spreadProps(__spreadValues({}, this.state), { reset: this.reset }), children: childrenOrFallback });
  }
};
var ErrorBoundary = forwardRef((props, ref) => {
  var _a;
  const group = (_a = useContext3(ErrorBoundaryGroupContext)) != null ? _a : { resetKey: 0 };
  const resetKeys = [group.resetKey, ...props.resetKeys || []];
  const baseErrorBoundaryRef = useRef3(null);
  useImperativeHandle(ref, () => ({
    reset: () => {
      var _a2;
      return (_a2 = baseErrorBoundaryRef.current) == null ? void 0 : _a2.reset();
    }
  }));
  return /* @__PURE__ */ jsx3(BaseErrorBoundary, __spreadProps(__spreadValues({}, props), { resetKeys, ref: baseErrorBoundaryRef }));
});
if (process.env.NODE_ENV !== "production") {
  ErrorBoundary.displayName = "ErrorBoundary";
}
var ErrorBoundaryContext = createContext3(null);

// src/wrap.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
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
        (acc, [WrapperComponent, wrapperProps]) => /* @__PURE__ */ jsx4(WrapperComponent, __spreadProps(__spreadValues({}, wrapperProps), { children: acc })),
        /* @__PURE__ */ jsx4(Component2, __spreadValues({}, props))
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

// src/Suspense.tsx
import { Fragment as Fragment2, jsx as jsx5 } from "react/jsx-runtime";
var SuspenseContext = createContext4({ fallback: void 0 });
var useFallbackWithContext = (fallback) => {
  const contextFallback = useContext4(SuspenseContext).fallback;
  return fallback === null ? null : fallback != null ? fallback : contextFallback;
};
var DefaultSuspense = (props) => {
  const fallback = useFallbackWithContext(props.fallback);
  return /* @__PURE__ */ jsx5(ReactSuspense, __spreadProps(__spreadValues({}, props), { fallback }));
};
if (process.env.NODE_ENV !== "production") {
  DefaultSuspense.displayName = "Suspense";
}
var CSROnly = (props) => {
  const isClient = useIsClient();
  const fallback = useFallbackWithContext(props.fallback);
  return isClient ? /* @__PURE__ */ jsx5(ReactSuspense, __spreadProps(__spreadValues({}, props), { fallback })) : /* @__PURE__ */ jsx5(Fragment2, { children: fallback });
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
export {
  Suspense,
  SuspenseContext,
  withSuspense
};
//# sourceMappingURL=Suspense.js.map