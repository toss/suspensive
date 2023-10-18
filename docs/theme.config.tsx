import Image from 'next/image'
import { useRouter } from 'next/router.js'
import { type DocsThemeConfig, useConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  banner: {
    key: 'suspensive banner',
    text: function Text() {
      return (
        <span>
          🎉 New Suspensive Documentation is released. <a href="/docs/why">read more →</a>
        </span>
      )
    },
    dismissible: true,
  },
  logo: function Logo() {
    return (
      <div className="flex items-center gap-1">
        <Image src="/img/logo_dark.png" width={34} height={34} alt="suspensive logo" />
        <strong>Suspensive</strong>
      </div>
    )
  },
  head: function Head() {
    const { title, frontMatter } = useConfig()
    const { asPath, defaultLocale, locale } = useRouter()
    const url = 'https://suspensive.org' + (defaultLocale === locale ? asPath : `/${locale}${asPath}`)

    return (
      <>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content={title || 'Suspensive'} />
        <meta property="og:url" content={url} />
        <meta property="og:description" content={frontMatter.description || 'Packages to use React Suspense easily'} />
        <meta property="og:image" content="/banner.png" />
        <link rel="icon" href="/favicon.ico" type="image/ico" />
      </>
    )
  },
  project: {
    link: 'https://github.com/suspensive/react',
  },
  docsRepositoryBase: 'https://github.com/suspensive/react/tree/main/docs',
  useNextSeoProps() {
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return {
        titleTemplate: '%s – Suspensive',
      }
    }
  },
  feedback: { content: '' },
  editLink: {
    text: function Text() {
      const router = useRouter()

      if (router.pathname.includes('.ko')) {
        return <>이 페이지를 수정하기 →</>
      }

      return <>Edit this page →</>
    },
  },
  sidebar: {
    titleComponent({ title }) {
      return <>{title}</>
    },
    defaultMenuCollapseLevel: 4,
    toggleButton: true,
  },
  i18n: [
    { locale: 'en', text: 'English' },
    { locale: 'ko', text: '한국어' },
  ],
  search: {
    placeholder: function Placeholder() {
      const router = useRouter()

      if (router.pathname.includes('.ko')) {
        return '검색어를 입력하세요...'
      }

      return 'Search documentation...'
    },
  },
  footer: {
    text: 'MIT 2023 © Jonghyeon Ko and the Suspensive authors.',
  },
  darkMode: false,
  nextThemes: {
    forcedTheme: 'dark',
  },
}

export default config
