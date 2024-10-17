import { type DocumentProps, Head, Html, Main, NextScript } from 'next/document'
import { SandPackCSS } from '@/components/Sandpack/SandPackCSS'

export default function Document(props: DocumentProps) {
  const pathname = props.__NEXT_DATA__.page
  let lang = pathname.split('/', 2)[1]

  if (!['en', 'ko'].includes(lang)) {
    lang = 'en'
  }

  return (
    <Html lang={lang}>
      <Head>
        <SandPackCSS />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
