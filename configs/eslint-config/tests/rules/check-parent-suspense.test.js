/**
 * @fileoverview Tests for check-parent-suspense rule
 * @author Suspensive Team
 */

import { RuleTester } from 'eslint'
import babelEslintParser from '@babel/eslint-parser'
import rule from '../../rules/check-parent-suspense.js'

const ruleTester = new RuleTester({
  languageOptions: {
    parser: babelEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module',
    parserOptions: {
      requireConfigFile: false,
      babelOptions: {
        presets: ['@babel/preset-react'],
      },
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
})

ruleTester.run('check-parent-suspense', rule, {
  valid: [
    // Valid: useSuspenseQuery wrapped in Suspense in same component
    {
      code: `
        function Component() {
          return (
            <Suspense fallback={<div>Loading...</div>}>
              <div>
                {(() => {
                  const query = useSuspenseQuery()
                  return <div>{query.data}</div>
                })()}
              </div>
            </Suspense>
          )
        }
      `,
    },

    // Valid: SuspenseQuery wrapped in Suspense
    {
      code: `
        function Component() {
          return (
            <Suspense fallback={<div>Loading...</div>}>
              <SuspenseQuery>
                {(data) => <div>{data}</div>}
              </SuspenseQuery>
            </Suspense>
          )
        }
      `,
    },

    // Valid: lazy component wrapped in Suspense
    {
      code: `
        const LazyComponent = lazy(() => import('./Component'))
        
        function App() {
          return (
            <Suspense fallback={<div>Loading...</div>}>
              <LazyComponent />
            </Suspense>
          )
        }
      `,
    },

    // Valid: nested Suspense boundaries
    {
      code: `
        function Component() {
          return (
            <Suspense fallback={<div>Outer loading...</div>}>
              <div>
                <Suspense fallback={<div>Inner loading...</div>}>
                  <SuspenseQuery>
                    {(data) => <div>{data}</div>}
                  </SuspenseQuery>
                </Suspense>
              </div>
            </Suspense>
          )
        }
      `,
    },

    // Valid: non-suspense hooks
    {
      code: `
        function Component() {
          const query = useQuery()
          return <div>{query.data}</div>
        }
      `,
    },

    // Valid: regular components
    {
      code: `
        function Component() {
          return <div>Hello World</div>
        }
      `,
    },
  ],

  invalid: [
    // Invalid: useSuspenseQuery not wrapped in Suspense
    {
      code: `
        function Component() {
          const query = useSuspenseQuery()
          return <div>{query.data}</div>
        }
      `,
      errors: [
        {
          messageId: 'missingSuspenseWrapper',
          data: { name: 'useSuspenseQuery' },
        },
      ],
    },

    // Invalid: useSuspenseInfiniteQuery not wrapped
    {
      code: `
        function Component() {
          const query = useSuspenseInfiniteQuery()
          return <div>{query.data}</div>
        }
      `,
      errors: [
        {
          messageId: 'missingSuspenseWrapper',
          data: { name: 'useSuspenseInfiniteQuery' },
        },
      ],
    },

    // Invalid: useSuspenseQueries not wrapped
    {
      code: `
        function Component() {
          const queries = useSuspenseQueries()
          return <div>{queries[0].data}</div>
        }
      `,
      errors: [
        {
          messageId: 'missingSuspenseWrapper',
          data: { name: 'useSuspenseQueries' },
        },
      ],
    },

    // Invalid: SuspenseQuery not wrapped in Suspense
    {
      code: `
        function Component() {
          return (
            <SuspenseQuery>
              {(data) => <div>{data}</div>}
            </SuspenseQuery>
          )
        }
      `,
      errors: [
        {
          messageId: 'missingSuspenseWrapper',
          data: { name: 'SuspenseQuery' },
        },
      ],
    },

    // Invalid: SuspenseInfiniteQuery not wrapped
    {
      code: `
        function Component() {
          return (
            <SuspenseInfiniteQuery>
              {(data) => <div>{data}</div>}
            </SuspenseInfiniteQuery>
          )
        }
      `,
      errors: [
        {
          messageId: 'missingSuspenseWrapper',
          data: { name: 'SuspenseInfiniteQuery' },
        },
      ],
    },

    // Invalid: lazy component not wrapped in Suspense
    {
      code: `
        const LazyComponent = lazy(() => import('./Component'))
        
        function App() {
          return <LazyComponent />
        }
      `,
      errors: [
        {
          messageId: 'missingLazySuspenseWrapper',
          data: { name: 'LazyComponent' },
        },
      ],
    },

    // Invalid: multiple violations
    {
      code: `
        function Component() {
          const query = useSuspenseQuery()
          return (
            <div>
              <SuspenseQuery>
                {(data) => <div>{data}</div>}
              </SuspenseQuery>
            </div>
          )
        }
      `,
      errors: [
        {
          messageId: 'missingSuspenseWrapper',
          data: { name: 'useSuspenseQuery' },
        },
        {
          messageId: 'missingSuspenseWrapper',
          data: { name: 'SuspenseQuery' },
        },
      ],
    },

    // Invalid: member expression usage
    {
      code: `
        function Component() {
          const query = TanStackQuery.useSuspenseQuery()
          return <div>{query.data}</div>
        }
      `,
      errors: [
        {
          messageId: 'missingSuspenseWrapper',
          data: { name: 'useSuspenseQuery' },
        },
      ],
    },
  ],
})

console.log('All tests passed!')
