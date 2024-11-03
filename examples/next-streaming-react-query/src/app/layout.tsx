import type { ReactNode } from 'react'
import { Providers } from './providers'

export const metadata = {
  title: 'Next HTML Streaming with Suspense',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
