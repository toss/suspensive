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
      We're preparing Suspensive v3 🚀{' '}
      <Link href="https://v3.suspensive.org/en/docs/migrate-to-v3">
        read more
      </Link>
      🚀
    </span>
  ),
  lastUpdated: 'Last updated on',
  editPage: 'Edit this page on GitHub',
}
