// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'React Boundary',
  tagline: 'All declarative boundaries on both CSR, SSR',
  url: 'https://react-boundary.suspensive.org',
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
          editUrl:
            'https://github.com/suspensive/suspensive/tree/main/docs/react-boundary',
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
        title: 'React Boundary',
        logo: {
          alt: 'React Boundary Logo',
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
            href: 'https://github.com/suspensive/suspensive/tree/main/packages/react-boundary',
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
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/suspensive/suspensive/tree/main/packages/react-boundary',
              },
            ],
          },
          {
            title: 'Suspensive libraries',
            items: [
              {
                label: 'Boundary',
                href: 'https://github.com/suspensive/suspensive/tree/main/packages/react-boundary',
              },
              {
                label: 'Query',
                href: 'https://github.com/suspensive/suspensive/tree/main/packages/react-query',
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
    }),
}

module.exports = config
