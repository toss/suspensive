import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import styles from './index.module.css';
function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    return (_jsx("header", Object.assign({ className: clsx('hero hero--primary', styles.heroBanner) }, { children: _jsxs("div", Object.assign({ className: "container" }, { children: [_jsx("h1", Object.assign({ className: "hero__title" }, { children: siteConfig.title })), _jsx("p", Object.assign({ className: "hero__subtitle" }, { children: siteConfig.tagline })), _jsx("div", Object.assign({ className: styles.buttons }, { children: _jsx(Link, Object.assign({ className: "button button--secondary button--lg", to: "/docs/intro" }, { children: "Docusaurus Tutorial - 5min \u23F1\uFE0F" })) }))] })) })));
}
export default function Home() {
    const { siteConfig } = useDocusaurusContext();
    return (_jsxs(Layout, Object.assign({ title: `Hello from ${siteConfig.title}`, description: "Description will go into a meta tag in <head />" }, { children: [_jsx(HomepageHeader, {}), _jsx("main", { children: _jsx(HomepageFeatures, {}) })] })));
}
//# sourceMappingURL=index.js.map