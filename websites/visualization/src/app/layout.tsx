import './global.css'
import { Metadata } from 'next'
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
      </body>
    </html>
  )
}
