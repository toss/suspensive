import nextra from 'nextra'
import { remarkSandpack } from 'remark-sandpack'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  defaultShowCopyCode: true,
  mdxOptions: {
    remarkPlugins: [remarkSandpack],
  },
})

export default withNextra({
  i18n: {
    locales: ['en', 'ko'],
    defaultLocale: 'en',
  },
})
