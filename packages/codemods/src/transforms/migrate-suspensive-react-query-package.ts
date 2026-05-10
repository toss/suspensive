import type { FileInfo } from 'jscodeshift'
import { createParserFromPath } from './utils/createParserFromPath'
import { detectTanStackVersion } from './utils/detectTanStackVersion'

const SOURCE = '@suspensive/react-query'

export default function transform(file: FileInfo): string {
  const j = createParserFromPath(file.path)
  const root = j(file.source)
  const target = `@suspensive/react-query-${detectTanStackVersion()}`

  root.find(j.ImportDeclaration, { source: { value: SOURCE } }).forEach((path) => {
    path.node.source = j.stringLiteral(target)
  })

  root.find(j.ExportNamedDeclaration, { source: { value: SOURCE } }).forEach((path) => {
    path.node.source = j.stringLiteral(target)
  })

  root.find(j.ExportAllDeclaration, { source: { value: SOURCE } }).forEach((path) => {
    path.node.source = j.stringLiteral(target)
  })

  return root.toSource()
}
