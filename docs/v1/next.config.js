// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

/** @type {import('next').NextConfig} */
module.exports = withNextra({
  i18n: {
    locales: ['en', 'ko'],
    defaultLocale: 'en',
  },
})
