'use client'

// Next.js App Router global error boundary.
// React swallows render errors unless an error boundary catches them — this
// boundary catches errors from the root layout and reports them to Sentry,
// then shows Next.js's default error page.
import * as Sentry from '@sentry/nextjs'
import NextError from 'next/error'
import { useEffect } from 'react'

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  )
}
