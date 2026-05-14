import type { ExportSpecifier, FileInfo, ImportSpecifier } from 'jscodeshift'
import { createParserFromPath } from './utils/createParserFromPath'
import { detectTanStackVersion } from './utils/detectTanStackVersion'

const SOURCE = '@suspensive/react-query'

const TANSTACK_TARGET = '@tanstack/react-query'

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

export default function transform(file: FileInfo): string {
  const j = createParserFromPath(file.path)
  const root = j(file.source)
  const suspensiveTarget = `@suspensive/react-query-${detectTanStackVersion()}`

  root.find(j.ImportDeclaration, { source: { value: SOURCE } }).forEach((path) => {
    const specifiers = path.node.specifiers ?? []
    const importKind = path.node.importKind

    if (specifiers.length === 0) {
      path.node.source = j.stringLiteral(suspensiveTarget)
      return
    }

    const hasNamespaceOrDefault = specifiers.some(
      (s) => s.type === 'ImportNamespaceSpecifier' || s.type === 'ImportDefaultSpecifier'
    )
    if (hasNamespaceOrDefault) {
      path.node.source = j.stringLiteral(suspensiveTarget)
      return
    }

    const tanstackSpecifiers: ImportSpecifier[] = []
    const suspensiveSpecifiers: ImportSpecifier[] = []

    for (const spec of specifiers) {
      if (spec.type !== 'ImportSpecifier') {
        continue
      }
      if (TANSTACK_APIS.includes(spec.imported.name)) {
        tanstackSpecifiers.push(spec)
      } else {
        suspensiveSpecifiers.push(spec)
      }
    }

    if (tanstackSpecifiers.length > 0) {
      const decl = j.importDeclaration(tanstackSpecifiers, j.stringLiteral(TANSTACK_TARGET))
      if (importKind === 'type') {
        decl.importKind = 'type'
      }
      path.insertBefore(decl)
    }
    if (suspensiveSpecifiers.length > 0) {
      const decl = j.importDeclaration(suspensiveSpecifiers, j.stringLiteral(suspensiveTarget))
      if (importKind === 'type') {
        decl.importKind = 'type'
      }
      path.insertBefore(decl)
    }

    j(path).remove()
  })

  root.find(j.ExportNamedDeclaration, { source: { value: SOURCE } }).forEach((path) => {
    const specifiers = path.node.specifiers
    if (!specifiers || specifiers.length === 0) {
      path.node.source = j.stringLiteral(suspensiveTarget)
      return
    }

    const tanstackSpecifiers: ExportSpecifier[] = []
    const suspensiveSpecifiers: ExportSpecifier[] = []

    for (const spec of specifiers) {
      const localName = spec.local?.name ?? ''
      if (TANSTACK_APIS.includes(localName)) {
        tanstackSpecifiers.push(spec)
      } else {
        suspensiveSpecifiers.push(spec)
      }
    }

    if (tanstackSpecifiers.length > 0) {
      const decl = j.exportNamedDeclaration(null, tanstackSpecifiers, j.stringLiteral(TANSTACK_TARGET))
      path.insertBefore(decl)
    }
    if (suspensiveSpecifiers.length > 0) {
      const decl = j.exportNamedDeclaration(null, suspensiveSpecifiers, j.stringLiteral(suspensiveTarget))
      path.insertBefore(decl)
    }

    j(path).remove()
  })

  root.find(j.ExportAllDeclaration, { source: { value: SOURCE } }).forEach((path) => {
    path.node.source = j.stringLiteral(suspensiveTarget)
  })

  return root.toSource()
}
