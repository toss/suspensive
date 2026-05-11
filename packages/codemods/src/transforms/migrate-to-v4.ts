import type { FileInfo } from 'jscodeshift'
import migrateSuspensiveReactQueryPackage from './migrate-suspensive-react-query-package'
import tanstackQueryImport from './tanstack-query-import'

export default function transform(file: FileInfo): string {
  const afterStep1 = migrateSuspensiveReactQueryPackage(file)
  return tanstackQueryImport({ ...file, source: afterStep1 })
}
