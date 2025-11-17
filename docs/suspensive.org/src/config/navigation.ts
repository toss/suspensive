export type NavItem = {
  title: string
  href?: string
  items?: NavItem[]
  hidden?: boolean
}

export const navigationConfig: Record<string, NavItem[]> = {
  en: [
    {
      title: 'Documentation',
      href: '/en/docs',
      items: [
        { title: 'Introduction', href: '/en/docs/introduction' },
        {
          title: 'React',
          items: [
            {
              title: 'Motivation',
              href: '/en/docs/react/motivation',
            },
            {
              title: 'Installation',
              href: '/en/docs/react/installation',
            },
            {
              title: 'ErrorBoundary',
              href: '/en/docs/react/ErrorBoundary',
            },
            {
              title: 'Suspense',
              href: '/en/docs/react/Suspense',
            },
            {
              title: 'ErrorBoundaryGroup',
              href: '/en/docs/react/ErrorBoundaryGroup',
            },
            {
              title: 'Delay',
              href: '/en/docs/react/Delay',
            },
            {
              title: 'Await',
              href: '/en/docs/react/Await',
            },
            {
              title: 'wrap',
              href: '/en/docs/react/wrap',
            },
            {
              title: 'Migration',
              items: [{ title: 'To v3', href: '/en/docs/react/migration/v3' }],
            },
          ],
        },
        {
          title: 'React Query',
          items: [
            {
              title: 'Motivation',
              href: '/en/docs/react-query/motivation',
            },
            {
              title: 'Installation',
              href: '/en/docs/react-query/installation',
            },
            {
              title: 'SuspenseQuery',
              href: '/en/docs/react-query/SuspenseQuery',
            },
            {
              title: 'SuspenseInfiniteQuery',
              href: '/en/docs/react-query/SuspenseInfiniteQuery',
            },
            {
              title: 'SuspenseQueries',
              href: '/en/docs/react-query/SuspenseQueries',
            },
            {
              title: 'QueryErrorBoundary',
              href: '/en/docs/react-query/QueryErrorBoundary',
            },
            {
              title: 'PrefetchQuery',
              href: '/en/docs/react-query/PrefetchQuery',
            },
            {
              title: 'PrefetchInfiniteQuery',
              href: '/en/docs/react-query/PrefetchInfiniteQuery',
            },
            {
              title: 'queryOptions',
              href: '/en/docs/react-query/queryOptions',
            },
            {
              title: 'infiniteQueryOptions',
              href: '/en/docs/react-query/infiniteQueryOptions',
            },
            {
              title: 'QueriesHydration',
              href: '/en/docs/react-query/QueriesHydration',
            },
            {
              title: 'QueryClientConsumer',
              href: '/en/docs/react-query/QueryClientConsumer',
            },
            { title: 'IsFetching', href: '/en/docs/react-query/IsFetching' },
          ],
        },
        {
          title: 'Jotai',
          items: [
            {
              title: 'Motivation',
              href: '/en/docs/jotai/motivation',
            },
            {
              title: 'Installation',
              href: '/en/docs/jotai/installation',
            },
            {
              title: 'AtomValue',
              href: '/en/docs/jotai/AtomValue',
            },
            {
              title: 'SetAtom',
              href: '/en/docs/jotai/SetAtom',
            },
          ],
        },
        {
          title: 'Codemods',
          items: [
            {
              title: 'Motivation',
              href: '/en/docs/codemods/motivation',
            },
          ],
        },
        {
          title: 'Migration',
          items: [
            {
              title: 'To v3',
              href: '/en/docs/migration/migrate-to-v3',
            },
            {
              title: 'To v2',
              href: '/en/docs/migration/migrate-to-v2',
            },
          ],
        },
      ],
    },
  ],
  ko: [
    {
      title: '문서',
      href: '/ko/docs',
      items: [
        { title: '소개', href: '/ko/docs/introduction' },
        {
          title: 'React',
          items: [
            {
              title: '동기',
              href: '/ko/docs/react/motivation',
            },
            {
              title: '설치',
              href: '/ko/docs/react/installation',
            },
            {
              title: 'ErrorBoundary',
              href: '/ko/docs/react/ErrorBoundary',
            },
            {
              title: 'Suspense',
              href: '/ko/docs/react/Suspense',
            },
            {
              title: 'ErrorBoundaryGroup',
              href: '/ko/docs/react/ErrorBoundaryGroup',
            },
            {
              title: 'Delay',
              href: '/ko/docs/react/Delay',
            },
            {
              title: 'Await',
              href: '/ko/docs/react/Await',
            },
            {
              title: 'wrap',
              href: '/ko/docs/react/wrap',
            },
            {
              title: '마이그레이션',
              items: [{ title: 'v3로', href: '/ko/docs/react/migration/v3' }],
            },
          ],
        },
        {
          title: 'React Query',
          items: [
            {
              title: '동기',
              href: '/ko/docs/react-query/motivation',
            },
            {
              title: '설치',
              href: '/ko/docs/react-query/installation',
            },
            {
              title: 'SuspenseQuery',
              href: '/ko/docs/react-query/SuspenseQuery',
            },
            {
              title: 'SuspenseInfiniteQuery',
              href: '/ko/docs/react-query/SuspenseInfiniteQuery',
            },
            {
              title: 'SuspenseQueries',
              href: '/ko/docs/react-query/SuspenseQueries',
            },
            {
              title: 'QueryErrorBoundary',
              href: '/ko/docs/react-query/QueryErrorBoundary',
            },
            {
              title: 'PrefetchQuery',
              href: '/ko/docs/react-query/PrefetchQuery',
            },
            {
              title: 'PrefetchInfiniteQuery',
              href: '/ko/docs/react-query/PrefetchInfiniteQuery',
            },
            {
              title: 'queryOptions',
              href: '/ko/docs/react-query/queryOptions',
            },
            {
              title: 'infiniteQueryOptions',
              href: '/ko/docs/react-query/infiniteQueryOptions',
            },
            {
              title: 'QueriesHydration',
              href: '/ko/docs/react-query/QueriesHydration',
            },
            {
              title: 'QueryClientConsumer',
              href: '/ko/docs/react-query/QueryClientConsumer',
            },
            {
              title: 'IsFetching',
              href: '/ko/docs/react-query/IsFetching',
            },
          ],
        },
        {
          title: 'Jotai',
          items: [
            {
              title: '동기',
              href: '/ko/docs/jotai/motivation',
            },
            {
              title: '설치',
              href: '/ko/docs/jotai/installation',
            },
            {
              title: 'AtomValue',
              href: '/ko/docs/jotai/AtomValue',
            },
            {
              title: 'SetAtom',
              href: '/ko/docs/jotai/SetAtom',
            },
          ],
        },
        {
          title: 'Codemods',
          items: [{ title: '동기', href: '/ko/docs/codemods/motivation' }],
        },
        {
          title: '마이그레이션',
          items: [
            {
              title: 'v3로',
              href: '/ko/docs/migration/migrate-to-v3',
            },
            {
              title: 'v2로',
              href: '/ko/docs/migration/migrate-to-v2',
            },
          ],
        },
      ],
    },
  ],
}
