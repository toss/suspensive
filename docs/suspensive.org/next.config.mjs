import nextra from 'nextra'
import { remarkSandpack } from 'remark-sandpack'

const withNextra = nextra({
  autoImportThemeStyle: true,
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  defaultShowCopyCode: true,
  latex: true,
  mdxOptions: {
    remarkPlugins: [remarkSandpack],
    rehypePlugins: [],
    rehypePrettyCodeOptions: {
      theme: 'github-dark-default',
      keepBackground: false,
    },
  },
  search: {
    codeblocks: true,
  },
  codeHighlight: true,
  readingTime: true,
})

/**
 * @type {import('next').NextConfig}
 */
export default withNextra({
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'ko'],
    defaultLocale: 'en',
  },
})
