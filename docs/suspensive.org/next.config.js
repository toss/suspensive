// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  defaultShowCopyCode: true,
  mdxOptions: {
    remarkPlugins: [
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('remark-sandpack').remarkSandpack,
    ],
  },
})

/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
module.exports = withNextra({
  i18n: {
    locales: ['en', 'ko'],
    defaultLocale: 'en',
  },
})
