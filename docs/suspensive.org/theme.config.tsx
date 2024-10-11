import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'nextra/hooks'
import { type DocsThemeConfig, useConfig } from 'nextra-theme-docs'
import './src/styles/globals.css'

const localeBanner = {
  en: (
    <span>
      👀 Check out the changes in Suspensive v2. <Link href="/en/docs/migrate-to-v2">read more →</Link>
    </span>
  ),
  ko: (
    <span>
      👀 Suspensive v2에서의 변경을 확인하세요. <Link href="/ko/docs/migrate-to-v2">더보기 →</Link>
    </span>
  ),
} as const

const config: DocsThemeConfig = {
  banner: {
    key: 'suspensive banner',
    content: function Text() {
      const { locale } = useRouter()
      return localeBanner[locale as keyof typeof localeBanner]
    },
    dismissible: true,
  },
  chat: {
    link: 'https://discord.gg/RFcR9WWmCH',
  },
  logo: function Logo() {
    return (
      <motion.div className="flex items-center gap-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <motion.span>
          <Image src="/img/logo_dark.png" width={34} height={34} alt="suspensive logo" />
        </motion.span>
        <div className="relative">
          <strong>Suspensive</strong>
          <span className="absolute text-[8px]">v2</span>
        </div>
      </motion.div>
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
    link: 'https://github.com/toss/suspensive',
  },
  docsRepositoryBase: 'https://github.com/toss/suspensive/tree/main/docs/suspensive.org',
  feedback: { content: '' },
  editLink: {
    content: function Text() {
      const { locale } = useRouter()

      if (locale === 'ko') {
        return <>이 페이지를 수정하기 →</>
      }

      return <>Edit this page →</>
    },
  },
  sidebar: {
    defaultMenuCollapseLevel: 4,
    toggleButton: true,
  },
  i18n: [
    { locale: 'en', name: 'English' },
    { locale: 'ko', name: '한국어' },
  ],
  search: {
    placeholder: function Placeholder() {
      const router = useRouter()

      if (router.locale === 'ko') {
        return '검색어를 입력하세요...'
      }

      return 'Search documentation...'
    },
  },
  footer: {
    content: 'MIT 2024 © Viva Republica, Inc.',
  },
  darkMode: false,
  nextThemes: {
    forcedTheme: 'dark',
  },
  toc: {
    backToTop: true,
    float: true,
  },
  navigation: true,
  main: ({ children }) => {
    const router = useRouter()

    return (
      <motion.div key={router.asPath} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        {children}
      </motion.div>
    )
  },
}

export default config
