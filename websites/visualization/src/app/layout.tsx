import './global.css'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Suspensive - Visualization',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <nav className="flex items-center justify-center bg-white/[.06] px-4 py-2 font-bold">
            <Link href="/">
              <div className="flex items-center justify-center">
                <Image src="/logo_not_cropped.png" width={40} height={40} alt="logo" />
                Visualization
              </div>
            </Link>
          </nav>
          <Link href="/react/DevMode">🔗 Go to @suspensive/react - DevMode</Link>
          <Link href="/react-image">🔗 Go to @suspensive/react-image</Link>
          <div className="flex flex-1 items-center justify-center">{children}</div>
        </Providers>
      </body>
    </html>
  )
}
