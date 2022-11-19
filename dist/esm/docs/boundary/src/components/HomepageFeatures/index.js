import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
const FeatureList = [
    {
        title: 'All Declarative Boundaries ready',
        description: 'AsyncBoundary, ErrorBoundary, ResetErrorBoundary, Suspense is provided. You can use them easily without any efforts',
    },
    {
        title: 'Only peer dependency, React',
        description: "It is simply extension of react's concepts. friendly name like Suspense, Error/Async/ResetBoundary",
    },
    {
        title: 'Support Sever-side rendering',
        description: "React Boundary provide SSRSafe apis that supports Server-side rendering that wrap react's Suspense",
    },
];
function Feature({ title, description }) {
    return (_jsx("div", Object.assign({ className: clsx('col col--4') }, { children: _jsxs("div", Object.assign({ className: "text--center padding-horiz--md" }, { children: [_jsx("h3", { children: title }), _jsx("p", { children: description })] })) })));
}
export default function HomepageFeatures() {
    return (_jsx("section", Object.assign({ className: styles.features }, { children: _jsx("div", Object.assign({ className: "container" }, { children: _jsx("div", Object.assign({ className: "row" }, { children: FeatureList.map((props, idx) => (_jsx(Feature, Object.assign({}, props), idx))) })) })) })));
}
//# sourceMappingURL=index.js.map