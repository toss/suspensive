// Sentry — Server (Node.js runtime) monitoring.
// Captures errors thrown while Next.js renders pages on the server.
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),

  // Attach local variable values to server stack frames for easier debugging.
  includeLocalVariables: true,
  // Forward server logs to Sentry's Logs product.
  enableLogs: true,
})
