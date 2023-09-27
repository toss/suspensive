// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const packages = {
  intro: 'websites/docs/',
  react: 'packages/',
  'react-query': 'packages/',
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Suspensive Libraries',
  tagline: 'Declarative components to use suspense for React',
  url: 'https://suspensive.org',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'suspensive', // Usually your GitHub org/user name.
  projectName: 'Suspensive', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko'],
    localeConfigs: {
      en: {
        htmlLang: 'en-US',
      },
      ko: {
        htmlLang: 'ko-KR',
      },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: (editUrlParams) => {
            const defaultUrl = 'https://github.com/suspensive/react/'
            const packageKey = editUrlParams.docPath.split('/')[0]
            const scope = packages[packageKey]
            const restPath = editUrlParams.docPath.replace('.i18n.', `.${editUrlParams.locale}.`)
            const editUrl = scope
              ? `${defaultUrl}blob/main/${scope}${restPath}`.replace('/README.en.md', '/README.md')
              : defaultUrl
            return editUrl
          },
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Suspensive',
        logo: {
          alt: 'Suspensive Logo',
          src: 'img/logo_light.png',
          srcDark: 'img/logo_dark.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro/motivation.i18n',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/suspensive/react',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/intro/motivation.i18n',
              },
              {
                label: 'Installation',
                to: '/docs/intro/installation.i18n',
              },
              {
                label: 'API Reference',
                to: '/docs/react/README.i18n',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/suspensive/react',
              },
              {
                label: 'Visualization',
                href: 'https://visualization.suspensive.org/react',
              },
            ],
          },
          {
            title: 'Libraries',
            items: [
              {
                label: '@suspensive/react',
                href: 'https://www.npmjs.com/package/@suspensive/react',
              },
              {
                label: '@suspensive/react-query',
                href: 'https://www.npmjs.com/package/@suspensive/react-query',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Jonghyeon Ko and the Suspensive authors.`,
      },
      prism: {
        theme: require('prism-react-renderer/themes/github'),
        darkTheme: require('prism-react-renderer/themes/dracula'),
      },
      colorMode: {
        respectPrefersColorScheme: true,
      },
      algolia: {
        appId: 'SAE4NOBAMB',
        apiKey: '3c1acc86feac8230e241562791f6a6d3',
        indexName: 'suspensive',
        branch: 'main',
        contextualSearch: true,
      },
    }),
}

module.exports = config
