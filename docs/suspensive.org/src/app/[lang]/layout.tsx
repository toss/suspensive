/* eslint-env node */
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { ClientOnly } from '@suspensive/react'
import type { Metadata } from 'next'
import Script from 'next/script'
import type { ReactNode } from 'react'
import { RootProvider } from 'fumadocs-ui/provider'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { getSource } from '@/lib/source'
import { getDictionary, getDirection } from '../_dictionaries/get-dictionary'
import './styles.css'
import { Logo } from './_components/Logo'
import { SandPackCSS } from '@/components/Sandpack/SandPackCSS'
import { STORAGE_KEYS } from '@/constants'
import type { Locale } from '@/i18n'

export const metadata = {
  title: {
    absolute: 'Suspensive',
    template: '%s | Suspensive',
    default: 'Suspensive',
  },
  description: 'All in one for React Suspense',
  metadataBase: new URL('https://suspensive.org'),
  openGraph: { images: '/img/banner.png' },
  icons: '/favicon.ico',
} satisfies Metadata

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  const source = getSource(lang)

  return (
    <html lang={lang} dir={getDirection(lang)} suppressHydrationWarning>
      <head>
        <ClientOnly>
          <SandPackCSS />
        </ClientOnly>
      </head>
      <body>
        <RootProvider
          search={{
            enabled: true,
          }}
          theme={{
            enabled: true,
            storageKey: STORAGE_KEYS.THEME,
          }}
        >
          <DocsLayout
            tree={source.pageTree}
            githubUrl="https://github.com/toss/suspensive"
            nav={{
              title: <Logo />,
            }}
            links={[
              {
                text: 'Discord',
                url: 'https://discord.gg/RFcR9WWmCH',
              },
            ]}
            i18n
          >
            {children}
          </DocsLayout>
        </RootProvider>
        <GoogleTagManager gtmId="G-NYQZGKRL0Y" />
        <GoogleAnalytics gaId="G-NYQZGKRL0Y" />
        <ClientOnly>
          <Script id="microsoft-clarity" type="text/javascript">
            {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "jnyd3uxeuz");
        `}
          </Script>
        </ClientOnly>
      </body>
    </html>
  )
}
