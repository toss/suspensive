import Link from 'next/link'
import type { ReactNode } from 'react'
import { Providers } from './providers'

export const metadata = {
  title: 'Next HTML Streaming with Suspense',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ul>
            <Link href="/">
              <li>to home page</li>
            </Link>
            <Link href="/test">
              <li>to test page</li>
            </Link>
            <Link href="/PrefetchBoundary">
              <li>to PrefetchBoundary page</li>
            </Link>
          </ul>
          <div style={{ border: '1px solid red' }}>{children}</div>
        </Providers>
      </body>
    </html>
  )
}
