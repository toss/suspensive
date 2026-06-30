import type { FileInfo, ImportDeclaration, ImportSpecifier } from 'jscodeshift'
import { createParserFromPath } from './utils/createParserFromPath'

const TANSTACK_APIS = [
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
  'usePrefetchInfiniteQuery',
  'queryOptions',
  'infiniteQueryOptions',
  'mutationOptions',
]

const REMOVE_DEPRECATED_IMPORTS = [
  'SelectedInfiniteOptions',
  'UnSelectedInfiniteOptions',
  'SelectedQueryOptions',
  'UnSelectedQueryOptions',
]

const SUSPENSIVE_SOURCE_PATTERN = /^@suspensive\/react-query(-\d+)?$/

function getClassificationName(specifier: ImportSpecifier): string {
  return specifier.imported.name
}

export default function transform(file: FileInfo): string {
  const j = createParserFromPath(file.path)
  const root = j(file.source)

  root
    .find(j.ImportDeclaration, {
      source: {
        value: (v: string) => SUSPENSIVE_SOURCE_PATTERN.test(v),
      },
    })
    .forEach((path) => {
      const importSpecifiers = path.node.specifiers || []
      const importKind = path.node.importKind

      type AnyImportSpecifier = NonNullable<ImportDeclaration['specifiers']>[number]
      const importNamesToChange: ImportSpecifier[] = []
      const importsNamesRemained: AnyImportSpecifier[] = []

      for (const specifier of importSpecifiers) {
        if (specifier.type !== 'ImportSpecifier') {
          importsNamesRemained.push(specifier)
          continue
        }
        const name = getClassificationName(specifier)
        if (TANSTACK_APIS.includes(name)) {
          importNamesToChange.push(specifier)
        } else if (!REMOVE_DEPRECATED_IMPORTS.includes(name)) {
          importsNamesRemained.push(specifier)
        }
      }

      if (importNamesToChange.length > 0) {
        const newImportStatement = j.importDeclaration(importNamesToChange, j.stringLiteral('@tanstack/react-query'))
        if (importKind === 'type') {
          newImportStatement.importKind = 'type'
        }
        path.insertBefore(newImportStatement)
      }
      if (importsNamesRemained.length > 0) {
        const suspensiveRemainImportsStatement = j.importDeclaration(
          importsNamesRemained,
          j.stringLiteral((path.node.source.value as string) || '@suspensive/react-query')
        )
        if (importKind === 'type') {
          suspensiveRemainImportsStatement.importKind = 'type'
        }
        path.insertBefore(suspensiveRemainImportsStatement)
      }

      j(path).remove()
    })

  root.find(j.ExportNamedDeclaration).forEach((path) => {
    if (!path.node.specifiers) {
      return
    }
    const exportSpecifiers = path.node.specifiers
    const originalSource = path.node.source

    const exportNamesToChange = exportSpecifiers.filter((specifier) =>
      TANSTACK_APIS.includes(specifier.local?.name ?? '')
    )
    const exportNamesRemained = exportSpecifiers.filter(
      (specifier) =>
        !TANSTACK_APIS.includes(specifier.local?.name ?? '') &&
        !REMOVE_DEPRECATED_IMPORTS.includes(specifier.local?.name ?? '')
    )

    if (exportNamesToChange.length > 0) {
      const targetSource =
        originalSource && SUSPENSIVE_SOURCE_PATTERN.test(originalSource.value as string)
          ? j.stringLiteral('@tanstack/react-query')
          : originalSource
      const newExportStatement = j.exportNamedDeclaration(null, exportNamesToChange, targetSource)
      path.insertBefore(newExportStatement)
    }
    if (exportNamesRemained.length > 0) {
      const remainingExportStatement = j.exportNamedDeclaration(null, exportNamesRemained, originalSource)
      path.insertBefore(remainingExportStatement)
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
