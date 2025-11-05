import Link from 'next/link'
import type { ReactNode } from 'react'
import { Providers } from './providers'
import './globals.css'

export const metadata = {
  title: 'Next HTML Streaming with Suspense',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="mx-2">
        <Providers>
          <ul style={{ display: 'flex', gap: '10px', margin: 0 }}>
            <Link href="/">
              <li style={{ listStyle: 'none' }}>home page</li>
            </Link>
            <Link href="/test">
              <li style={{ listStyle: 'none' }}>test page</li>
            </Link>
          </ul>
          <div>{children}</div>
        </Providers>
      </body>
    </html>
  )
}
