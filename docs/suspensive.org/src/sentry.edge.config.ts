// Sentry — Edge runtime monitoring (middleware, edge routes).
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  enableLogs: true,
})
