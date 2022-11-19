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
    return (_jsx("header", Object.assign({ className: clsx(styles.heroBanner), style: { backgroundColor: '#1C1C1D' } }, { children: _jsxs("div", Object.assign({ className: "container", style: { color: 'white' } }, { children: [_jsx("img", { src: "img/logo_notcropped.png", alt: "logo", style: { height: 180, width: 180, marginBottom: -16 } }), _jsx("h1", Object.assign({ className: "hero__title" }, { children: siteConfig.title })), _jsx("p", Object.assign({ className: "hero__subtitle" }, { children: siteConfig.tagline })), _jsx("div", Object.assign({ className: styles.buttons }, { children: _jsx(Link, Object.assign({ className: "button button--secondary button--lg", to: "/docs/intro/motivation" }, { children: "Get started" })) }))] })) })));
}
export default function Home() {
    return (_jsxs(Layout, { children: [_jsx(HomepageHeader, {}), _jsx("main", { children: _jsx(HomepageFeatures, {}) })] }));
}
//# sourceMappingURL=index.js.map