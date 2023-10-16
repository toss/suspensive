import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

export default withNextra({
  i18n: {
    locales: ['en', 'ko'],
    defaultLocale: 'en',
  },
})
