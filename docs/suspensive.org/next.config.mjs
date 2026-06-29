import { withSentryConfig } from '@sentry/nextjs'
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
const nextConfig = withNextra({
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'ko'],
    defaultLocale: 'en',
  },
})

// withSentryConfig uploads source maps at build time so stack traces in the
// Sentry dashboard point to readable source instead of minified code.
// Source-map upload only runs when SENTRY_AUTH_TOKEN is present (e.g. in CI),
// so local builds and PRs are unaffected.
export default withSentryConfig(nextConfig, {
  org: 'suspensive',
  project: 'suspensive-org',
  // Secret — set in CI to upload source maps. Source-map upload is skipped
  // (build still succeeds) when this is absent, e.g. local builds and PRs.
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  // Upload a wider set of client bundles so production stack traces resolve
  // to readable source instead of minified code.
  widenClientFileUpload: true,
  // Tunnel Sentry requests through your own domain to dodge ad blockers
  // that would otherwise drop browser error reports. Excluded from the i18n
  // proxy matcher in src/proxy.ts so the tunnel isn't locale-redirected.
  tunnelRoute: '/monitoring',
})
