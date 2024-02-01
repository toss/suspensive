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
          <Link href="/react/DevMode">🔗 @suspensive/react - DevMode</Link>
          <Link href="/react/Delay">🔗 @suspensive/react - Delay</Link>
          <Link href="/react/ErrorBoundary/shouldCatch">🔗 @suspensive/react - ErrorBoundary shouldCatch</Link>
          <Link href="/react/zodSearchParams">🔗 @suspensive/react - with zod: no param</Link>
          <Link href="/react/zodSearchParams?id=1">🔗 @suspensive/react - with zod: id=1</Link>
          <Link href="/react/zodSearchParams?id=0.1">🔗 @suspensive/react - with zod: id=0.1</Link>
          <Link href="/react/zodSearchParams?id=-1">🔗 @suspensive/react - with zod: id=-1</Link>

          <Link href="/react-image/SuspenseImage">🔗 @suspensive/react-image - SuspenseImage</Link>
          <Link href="/react-await/Await">🔗 @suspensive/react-await - Await</Link>
          <div className="flex flex-1 items-center justify-center">{children}</div>
        </Providers>
      </body>
    </html>
  )
}
