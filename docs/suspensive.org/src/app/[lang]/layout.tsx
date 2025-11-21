/* eslint-env node */
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { ClientOnly } from '@suspensive/react'
import type { Metadata } from 'next'
import Script from 'next/script'
import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'
import { getDictionary, getDirection } from '../_dictionaries/get-dictionary'
import './styles.css'
import { Logo } from './_components/Logo'
import { Footer, LocaleSwitch, Navbar, Search } from '@/components/layout'
import { SandPackCSS } from '@/components/Sandpack/SandPackCSS'

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
  params: Promise<{ lang: 'en' | 'ko' }>
}) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)

  return (
    <html lang={lang} dir={getDirection(lang)} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="rgb(0,0,0)" />
        <ClientOnly>
          <SandPackCSS />
        </ClientOnly>
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme={'system'}
          storageKey={'theme'}
          enableSystem
        >
          <Navbar
            logo={<Logo />}
            projectLink="https://github.com/toss/suspensive"
            chatLink="https://discord.gg/RFcR9WWmCH"
            search={<Search placeholder={dictionary.search.placeholder} />}
          >
            <LocaleSwitch
              locales={[
                { locale: 'en', name: 'English' },
                { locale: 'ko', name: '한국어' },
              ]}
            />
          </Navbar>
          <div className="min-h-screen">{children}</div>
        </ThemeProvider>
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
