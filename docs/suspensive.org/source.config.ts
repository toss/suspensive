import { defineConfig, defineDocs } from 'fumadocs-mdx/config'
import { remarkCodeHike, recmaCodeHike } from 'codehike/mdx'
import { remarkSandpack } from 'remark-sandpack'

/** @type {import('codehike/mdx').CodeHikeConfig} */
const chConfig = {
  syntaxHighlighting: {
    theme: 'github-dark',
  },
}

export default defineConfig({
  generateManifest: true,
  lastModifiedTime: 'git',
  mdxOptions: {
    remarkPlugins: [[remarkCodeHike, chConfig], remarkSandpack],
    recmaPlugins: [[recmaCodeHike, chConfig]],
  },
})

export const docs = defineDocs({
  dir: 'src/content',
  // Disable image optimization to avoid fetching external images during build
  remark: {
    images: {
      enabled: false,
    },
  },
})
