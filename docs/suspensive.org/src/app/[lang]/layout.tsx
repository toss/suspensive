/* eslint-env node */
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { ClientOnly } from '@suspensive/react'
import type { Metadata } from 'next'
import Script from 'next/script'
import { Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import {
  Footer,
  LastUpdated,
  Layout,
  LocaleSwitch,
  Navbar,
} from 'nextra-theme-docs'
import type { ReactNode } from 'react'
import { getDictionary, getDirection } from '../_dictionaries/get-dictionary'
import './styles.css'
import { Logo } from './_components/Logo'
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
  icons: '/img/favicon.ico',
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
  const pageMap = await getPageMap(lang)

  return (
    <html lang={lang} dir={getDirection(lang)} suppressHydrationWarning>
      <Head backgroundColor={{ dark: 'rgb(0,0,0)' }}>
        <ClientOnly>
          <SandPackCSS />
        </ClientOnly>
      </Head>
      <body>
        <Layout
          darkMode={false}
          search={<Search placeholder={dictionary.search.placeholder} />}
          navbar={
            <Navbar
              logo={<Logo />}
              projectLink="https://github.com/toss/suspensive"
              chatLink="https://discord.gg/RFcR9WWmCH"
            >
              <LocaleSwitch />
            </Navbar>
          }
          footer={
            <Footer>
              MIT {new Date().getFullYear()} © Viva Republica, Inc.
            </Footer>
          }
          docsRepositoryBase="https://github.com/toss/suspensive/tree/main/docs/suspensive.org"
          i18n={[
            { locale: 'en', name: 'English' },
            { locale: 'ko', name: '한국어' },
          ]}
          sidebar={{
            defaultMenuCollapseLevel: 2,
            autoCollapse: true,
            toggleButton: true,
          }}
          toc={{
            ...dictionary.toc,
            float: true,
          }}
          editLink={dictionary.editPage}
          pageMap={pageMap}
          nextThemes={{ defaultTheme: 'dark' }}
          feedback={{ content: '' }}
          lastUpdated={<LastUpdated>{dictionary.lastUpdated}</LastUpdated>}
        >
          {children}
        </Layout>
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
