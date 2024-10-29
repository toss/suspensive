import type j from 'jscodeshift'
import { createParserFromPath } from '../utils'

const IMPORT_TO_CHANGE = [
  'useSuspenseQuery',
  'UseSuspenseQueryResult',
  'UseSuspenseQueryOptions',
  'useSuspenseQueries',
  'SuspenseQueriesResults',
  'SuspenseQueriesOptions',
  'useSuspenseInfiniteQuery',
  'UseSuspenseInfiniteQueryResult',
  'UseSuspenseInfiniteQueryOptions',
  'usePrefetchQuery',
  'queryOptions',
  'infiniteQueryOption',
]

export default function transformer(file: j.FileInfo) {
  const j = createParserFromPath(file.path)
  const root = j(file.source)

  root
    .find(j.ImportDeclaration, {
      source: {
        value: '@suspensive/react-query',
      },
    })
    .forEach((path) => {
      const importSpecifiers = path.node.specifiers || []

      const importNamesToChange = importSpecifiers.filter((specifier) =>
        IMPORT_TO_CHANGE.includes(specifier.local?.name ?? '')
      )
      const importsNamesRemained = importSpecifiers.filter(
        (specifier) => !IMPORT_TO_CHANGE.includes(specifier.local?.name ?? '')
      )

      if (importNamesToChange.length > 0) {
        const newImportStatement = j.importDeclaration(importNamesToChange, j.stringLiteral('@tanstack/react-query'))
        path.insertBefore(newImportStatement)
      }
      if (importsNamesRemained.length > 0) {
        const remainingSpecifiers = importSpecifiers.filter(
          (specifier) => !IMPORT_TO_CHANGE.includes(specifier.local?.name ?? '')
        )

        const suspensiveReactQueryRemainImportsStatement = j.importDeclaration(
          remainingSpecifiers,
          j.stringLiteral('@suspensive/react-query')
        )
        path.insertBefore(suspensiveReactQueryRemainImportsStatement)
      }
      j(path).remove()
    })
    .toSource()

  return root.toSource()
}
