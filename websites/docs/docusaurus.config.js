// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const darkCodeTheme = require('prism-react-renderer/themes/dracula')
const lightCodeTheme = require('prism-react-renderer/themes/github')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Suspensive',
  tagline: 'Declarative components to use suspense for React',
  url: 'https://react.suspensive.org',
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
    locales: ['en'],
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
          editUrl: 'https://github.com/suspensive/react/tree/main/docs/react',
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
      colorMode: {
        defaultMode: 'dark',
      },
      navbar: {
        title: 'Suspensive',
        logo: {
          alt: 'Suspensive Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro/motivation',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/suspensive/react/tree/main/packages/react',
            label: 'GitHub',
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
                to: '/docs/intro/motivation',
              },
              {
                label: 'Installation',
                to: '/docs/intro/installation',
              },
              {
                label: 'API Reference',
                to: '/docs/reference/suspense',
              },
              {
                label: 'Visualization',
                href: 'https://visualization.suspensive.org/react',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/suspensive/react/tree/main/packages/react',
              },
            ],
          },
          {
            title: 'Libraries',
            items: [
              {
                label: '@suspensive/react',
                href: 'https://github.com/suspensive/react/tree/main/packages/react',
              },
              {
                label: '@suspensive/react-query',
                href: 'https://github.com/suspensive/react/tree/main/packages/react-query',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Jonghyeon Ko and the Suspensive authors.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      // TODO: Apply Algolia
      // algolia: {
      //   // The application ID provided by Algolia
      //   appId: 'YOUR_APP_ID',

      //   // Public API key: it is safe to commit it
      //   apiKey: 'YOUR_SEARCH_API_KEY',

      //   indexName: 'YOUR_INDEX_NAME',

      //   // Optional: see doc section below
      //   contextualSearch: true,

      //   // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
      //   externalUrlRegex: 'external\\.com|domain\\.com',

      //   // Optional: Algolia search parameters
      //   searchParameters: {},

      //   // Optional: path for search page that enabled by default (`false` to disable it)
      //   searchPagePath: 'search',

      //   //... other Algolia params
      // },
    }),
}

module.exports = config
