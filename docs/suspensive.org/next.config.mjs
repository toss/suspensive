import { recmaCodeHike, remarkCodeHike } from 'codehike/mdx'
import { remarkSandpack } from 'remark-sandpack'
import { createMDX } from 'fumadocs-mdx/next'

/** @type {import('codehike/mdx').CodeHikeConfig} */
const chConfig = {
  syntaxHighlighting: {
    theme: 'github-dark',
  },
}

const withMDX = createMDX({
  mdxOptions: {
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
})
