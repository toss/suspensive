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
  docs: [
    {
      dir: 'src/content/en',
      output: 'src/content/en/.map.ts',
    },
    {
      dir: 'src/content/ko',
      output: 'src/content/ko/.map.ts',
    },
  ],
})
