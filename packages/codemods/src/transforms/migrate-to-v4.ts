import type { ExportSpecifier, FileInfo, ImportSpecifier } from 'jscodeshift'
import { createParserFromPath } from './utils/createParserFromPath'
import { detectTanStackVersion } from './utils/detectTanStackVersion'

const UNVERSIONED_SOURCE = '@suspensive/react-query'
const SOURCE_PATTERN = /^@suspensive\/react-query(-\d+)?$/
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

const DEPRECATED_REMOVED = [
  'SelectedInfiniteOptions',
  'UnSelectedInfiniteOptions',
  'SelectedQueryOptions',
  'UnSelectedQueryOptions',
]

export default function transform(file: FileInfo): string {
  const j = createParserFromPath(file.path)
  const root = j(file.source)
  const versionedTarget = `@suspensive/react-query-${detectTanStackVersion()}`

  const resolveSuspensiveTarget = (currentSource: string): string =>
    currentSource === UNVERSIONED_SOURCE ? versionedTarget : currentSource

  root
    .find(j.ImportDeclaration, {
      source: { value: (v: string) => SOURCE_PATTERN.test(v) },
    })
    .forEach((path) => {
      const specifiers = path.node.specifiers ?? []
      const importKind = path.node.importKind
      const currentSource = path.node.source.value as string
      const suspensiveTarget = resolveSuspensiveTarget(currentSource)

      if (specifiers.length === 0) {
        if (currentSource !== suspensiveTarget) {
          path.node.source = j.stringLiteral(suspensiveTarget)
        }
        return
      }

      const hasNamespaceOrDefault = specifiers.some(
        (s) => s.type === 'ImportNamespaceSpecifier' || s.type === 'ImportDefaultSpecifier'
      )
      if (hasNamespaceOrDefault) {
        if (currentSource !== suspensiveTarget) {
          path.node.source = j.stringLiteral(suspensiveTarget)
        }
        return
      }

      const tanstackSpecifiers: ImportSpecifier[] = []
      const suspensiveSpecifiers: ImportSpecifier[] = []

      for (const spec of specifiers) {
        if (spec.type !== 'ImportSpecifier') {
          continue
        }
        const name = spec.imported.name
        if (DEPRECATED_REMOVED.includes(name)) {
          continue
        }
        if (TANSTACK_APIS.includes(name)) {
          tanstackSpecifiers.push(spec)
        } else {
          suspensiveSpecifiers.push(spec)
        }
      }

      if (tanstackSpecifiers.length === 0 && suspensiveSpecifiers.length === specifiers.length) {
        if (currentSource !== suspensiveTarget) {
          path.node.source = j.stringLiteral(suspensiveTarget)
        }
        return
      }

      if (tanstackSpecifiers.length > 0) {
        const tanstackDecl = j.importDeclaration(tanstackSpecifiers, j.stringLiteral(TANSTACK_TARGET))
        if (importKind === 'type') {
          tanstackDecl.importKind = 'type'
        }
        path.insertBefore(tanstackDecl)
      }
      if (suspensiveSpecifiers.length > 0) {
        const suspensiveDecl = j.importDeclaration(suspensiveSpecifiers, j.stringLiteral(suspensiveTarget))
        if (importKind === 'type') {
          suspensiveDecl.importKind = 'type'
        }
        path.insertBefore(suspensiveDecl)
      }

      j(path).remove()
    })

  root
    .find(j.ExportNamedDeclaration, {
      source: { value: (v: string) => SOURCE_PATTERN.test(v) },
    })
    .forEach((path) => {
      const specifiers = path.node.specifiers
      const currentSource = path.node.source?.value as string | undefined
      if (!currentSource) {
        return
      }
      const suspensiveTarget = resolveSuspensiveTarget(currentSource)

      if (!specifiers || specifiers.length === 0) {
        if (currentSource !== suspensiveTarget) {
          path.node.source = j.stringLiteral(suspensiveTarget)
        }
        return
      }

      const tanstackSpecifiers: ExportSpecifier[] = []
      const suspensiveSpecifiers: ExportSpecifier[] = []

      for (const spec of specifiers) {
        const localName = spec.local?.name ?? ''
        if (DEPRECATED_REMOVED.includes(localName)) {
          continue
        }
        if (TANSTACK_APIS.includes(localName)) {
          tanstackSpecifiers.push(spec)
        } else {
          suspensiveSpecifiers.push(spec)
        }
      }

      if (tanstackSpecifiers.length === 0 && suspensiveSpecifiers.length === specifiers.length) {
        if (currentSource !== suspensiveTarget) {
          path.node.source = j.stringLiteral(suspensiveTarget)
        }
        return
      }

      if (tanstackSpecifiers.length > 0) {
        const tanstackDecl = j.exportNamedDeclaration(null, tanstackSpecifiers, j.stringLiteral(TANSTACK_TARGET))
        path.insertBefore(tanstackDecl)
      }
      if (suspensiveSpecifiers.length > 0) {
        const suspensiveDecl = j.exportNamedDeclaration(null, suspensiveSpecifiers, j.stringLiteral(suspensiveTarget))
        path.insertBefore(suspensiveDecl)
      }

      j(path).remove()
    })

  root
    .find(j.ExportAllDeclaration, {
      source: { value: (v: string) => SOURCE_PATTERN.test(v) },
    })
    .forEach((path) => {
      const currentSource = path.node.source.value as string
      const suspensiveTarget = resolveSuspensiveTarget(currentSource)
      if (currentSource !== suspensiveTarget) {
        path.node.source = j.stringLiteral(suspensiveTarget)
      }
    })

  return root.toSource()
}
