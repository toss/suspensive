import './global.css'
import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
import { CommonLayout } from './CommonLayout'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Suspensive - Visualization',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <CommonLayout>{children}</CommonLayout>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
