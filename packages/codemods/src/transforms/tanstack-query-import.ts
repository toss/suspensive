import type { FileInfo } from 'jscodeshift'
import { createParserFromPath } from './utils/createParserFromPath'

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
  'infiniteQueryOptions',
]

const SUSPENSIVE_REACT_QUERY_SOURCE = /^@suspensive\/react-query(-\d+)?$/

const REMOVE_DEPRECATED_IMPORTS = [
  'SelectedInfiniteOptions',
  'UnSelectedInfiniteOptions',
  'SelectedQueryOptions',
  'UnSelectedQueryOptions',
]

export default function transform(file: FileInfo): string {
  const j = createParserFromPath(file.path)
  const root = j(file.source)

  root
    .find(j.ImportDeclaration, {
      source: {
        value: (v: string) => SUSPENSIVE_REACT_QUERY_SOURCE.test(v),
      },
    })
    .forEach((path) => {
      const importSpecifiers = path.node.specifiers || []

      const importNamesToChange = importSpecifiers.filter((specifier) =>
        IMPORT_TO_CHANGE.includes(specifier.local?.name ?? '')
      )
      const importsNamesRemained = importSpecifiers.filter(
        (specifier) =>
          !IMPORT_TO_CHANGE.includes(specifier.local?.name ?? '') &&
          !REMOVE_DEPRECATED_IMPORTS.includes(specifier.local?.name ?? '')
      )

      if (importNamesToChange.length > 0) {
        const newImportStatement = j.importDeclaration(importNamesToChange, j.stringLiteral('@tanstack/react-query'))
        path.insertBefore(newImportStatement)
      }
      if (importsNamesRemained.length > 0) {
        const remainingSpecifiers = importSpecifiers.filter(
          (specifier) => !IMPORT_TO_CHANGE.includes(specifier.local?.name ?? '')
        )

        const suspensiveRemainImportsStatement = j.importDeclaration(
          remainingSpecifiers,
          j.stringLiteral((path.node.source.value as string) || '@suspensive/react-query')
        )
        path.insertBefore(suspensiveRemainImportsStatement)
      }

      j(path).remove()
    })

  root.find(j.ExportNamedDeclaration).forEach((path) => {
    const { declaration, specifiers, source } = path.node
    if (declaration || !specifiers?.length) return
    if (source && !SUSPENSIVE_REACT_QUERY_SOURCE.test(source.value as string)) return

    const exportNamesToChange = specifiers.filter((specifier) => IMPORT_TO_CHANGE.includes(specifier.local?.name ?? ''))
    const exportNamesRemained = specifiers.filter(
      (specifier) =>
        !IMPORT_TO_CHANGE.includes(specifier.local?.name ?? '') &&
        !REMOVE_DEPRECATED_IMPORTS.includes(specifier.local?.name ?? '')
    )

    if (exportNamesToChange.length > 0) {
      path.insertBefore(
        j.exportNamedDeclaration(null, exportNamesToChange, source ? j.stringLiteral('@tanstack/react-query') : null)
      )
    }
    if (exportNamesRemained.length > 0) {
      path.insertBefore(j.exportNamedDeclaration(null, exportNamesRemained, source))
    }

    j(path).remove()
  })

  REMOVE_DEPRECATED_IMPORTS.forEach((deprecatedType) => {
    root
      .find(j.TSTypeReference, {
        typeName: { name: deprecatedType },
      })
      .remove()

    root.find(j.Identifier, { name: deprecatedType }).remove()
  })

  return root.toSource()
}
