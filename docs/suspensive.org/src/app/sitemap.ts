import type { MetadataRoute } from 'next'

const BASE_URL = 'https://suspensive.org'

const locales = ['en', 'ko'] as const

function entry(
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'weekly',
  priority?: number
): MetadataRoute.Sitemap[number] {
  return {
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(
        locales.map((locale) => [locale, `${BASE_URL}/${locale}${path}`])
      ),
    },
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Landing
    entry('/', 'weekly', 1.0),

    // Introduction
    entry('/docs/introduction', 'weekly', 0.9),

    // @suspensive/react
    entry('/docs/react/motivation', 'monthly', 0.8),
    entry('/docs/react/installation', 'monthly', 0.8),
    entry('/docs/react/getting-started', 'monthly', 0.9),
    entry('/docs/react/comparison', 'monthly', 0.9),
    entry('/docs/react/Suspense', 'weekly', 0.9),
    entry('/docs/react/ErrorBoundary', 'weekly', 0.9),
    entry('/docs/react/ErrorBoundaryGroup', 'weekly', 0.8),
    entry('/docs/react/Delay', 'weekly', 0.7),
    entry('/docs/react/ClientOnly', 'weekly', 0.7),
    entry('/docs/react/DefaultPropsProvider', 'weekly', 0.7),
    entry('/docs/react/lazy', 'weekly', 0.6),
    entry('/docs/react/useIsClient', 'weekly', 0.6),

    // @suspensive/react-query
    entry('/docs/react-query/motivation', 'monthly', 0.8),
    entry('/docs/react-query/installation', 'monthly', 0.8),
    entry('/docs/react-query/SuspenseQuery', 'weekly', 0.9),
    entry('/docs/react-query/SuspenseQueries', 'weekly', 0.8),
    entry('/docs/react-query/SuspenseInfiniteQuery', 'weekly', 0.8),
    entry('/docs/react-query/Mutation', 'weekly', 0.7),
    entry('/docs/react-query/PrefetchQuery', 'weekly', 0.7),
    entry('/docs/react-query/PrefetchInfiniteQuery', 'weekly', 0.7),
    entry('/docs/react-query/QueriesHydration', 'weekly', 0.7),
    entry('/docs/react-query/QueryClientConsumer', 'weekly', 0.6),
    entry('/docs/react-query/IsFetching', 'weekly', 0.6),
    entry('/docs/react-query/createGetQueryClient', 'weekly', 0.7),
    entry('/docs/react-query/mutationOptions', 'weekly', 0.7),
    entry('/docs/react-query/usePrefetchQuery', 'weekly', 0.7),
    entry('/docs/react-query/usePrefetchInfiniteQuery', 'weekly', 0.7),

    // @suspensive/jotai
    entry('/docs/jotai/motivation', 'monthly', 0.7),
    entry('/docs/jotai/installation', 'monthly', 0.7),
    entry('/docs/jotai/Atom', 'weekly', 0.7),
    entry('/docs/jotai/AtomValue', 'weekly', 0.7),
    entry('/docs/jotai/SetAtom', 'weekly', 0.7),

    // @suspensive/codemods
    entry('/docs/codemods/motivation', 'monthly', 0.6),
    entry('/docs/codemods/usage', 'monthly', 0.6),

    // Migration guides
    entry('/docs/migration/migrate-to-v3', 'monthly', 0.7),
    entry('/docs/migration/migrate-to-v2', 'monthly', 0.5),

    // Other
    entry('/docs/changelogs', 'weekly', 0.5),
    entry('/docs/contributors', 'monthly', 0.4),
    entry('/docs/links', 'monthly', 0.4),
  ]
}
