import { Link } from 'nextra-theme-docs'

export default {
  toc: {
    title: 'On This Page',
    backToTop: 'Scroll to top',
  },
  search: { placeholder: 'Search Documentation...' },
  footer: {
    editLink: 'Edit this page on GitHub',
  },
  banner: (
    <span>
      👀 Check out the changes in Suspensive v2.{' '}
      <Link href="/en/docs/migrate-to-v2">read more →</Link>
    </span>
  ),
  lastUpdated: 'Last updated on',
  editPage: 'Edit this page on GitHub',
}
