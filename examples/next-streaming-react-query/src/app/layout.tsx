import type { ReactNode } from 'react'
import { Nav } from './_components/Nav'
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
          <Nav />
          <div>{children}</div>
        </Providers>
      </body>
    </html>
  )
}
