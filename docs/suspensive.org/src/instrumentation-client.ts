// Sentry — Client (browser) monitoring.
// This file runs in every visitor's browser. It captures:
//   1. Uncaught JS errors / unhandled promise rejections
//   2. Web Vitals (loading speed, interactivity, layout shift) via browser tracing
//
// It safely no-ops when NEXT_PUBLIC_SENTRY_DSN is not set, so the site
// keeps working locally / in PRs before the DSN is configured.
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // Performance monitoring. browserTracingIntegration (enabled by default)
  // records Web Vitals for each page load. 100% in dev so you see everything;
  // 10% in production to stay within Sentry's transaction quota.
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,

  // Only send events when a DSN is configured.
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),

  integrations: [
    Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] }),
  ],
  enableLogs: true,
})

// Lets Sentry tie errors to the App Router navigation that caused them.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
