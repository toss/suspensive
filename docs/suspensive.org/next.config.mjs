import { recmaCodeHike, remarkCodeHike } from 'codehike/mdx'
import createMDX from '@next/mdx'
import { remarkSandpack } from 'remark-sandpack'

/** @type {import('codehike/mdx').CodeHikeConfig} */
const chConfig = {
  syntaxHighlighting: {
    theme: 'github-dark',
  },
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [[remarkCodeHike, chConfig], remarkSandpack],
    recmaPlugins: [[recmaCodeHike, chConfig]],
    rehypePlugins: [],
  },
})

/**
 * @type {import('next').NextConfig}
 */
export default withMDX({
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  transpilePackages: ['@suspensive/react', '@suspensive/react-query-4'],
})
