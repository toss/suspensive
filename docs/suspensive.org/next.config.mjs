import { recmaCodeHike, remarkCodeHike } from 'codehike/mdx'
import nextra from 'nextra'
import { remarkSandpack } from 'remark-sandpack'

/** @type {import('codehike/mdx').CodeHikeConfig} */
const chConfig = {
  syntaxHighlighting: {
    theme: 'github-dark',
  },
}

const withNextra = nextra({
  defaultShowCopyCode: true,
  latex: true,
  mdxOptions: {
    remarkPlugins: [[remarkCodeHike, chConfig], remarkSandpack],
    recmaPlugins: [[recmaCodeHike, chConfig]],
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
  async rewrites() {
    return [
      {
        source: '/_pagefind/:path*',
        destination: '/api/pagefind/:path*',
      },
      {
        source: '/llms.txt',
        destination: '/api/llms/llms.txt',
      },
      {
        source: '/llms-full.txt',
        destination: '/api/llms/llms-full.txt',
      },
      {
        source: '/docs/:path*.md',
        destination: '/api/llms/docs/:path*.md',
      },
    ]
  },
})
