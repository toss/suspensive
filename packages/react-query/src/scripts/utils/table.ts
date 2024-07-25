import Table from 'cli-table3'
import {
  getExportAPIsWithoutSuspensive,
  getPackageJson,
  getSuspensiveReactQueryPackageJson,
  getTanStackReactQueryPackageJson,
  getTargetSuspensiveReactQueryAPIs,
} from './package'

export function getStatusTable(currentTargetVersion: string) {
  const packageJson = getPackageJson()
  const tanStackReactQueryPackageJson = getTanStackReactQueryPackageJson()
  const tanStackReactQueryMajorVersion = tanStackReactQueryPackageJson.version.split('.')[0]
  const targetSuspensiveReactQueryPackageJson = getSuspensiveReactQueryPackageJson(tanStackReactQueryMajorVersion)
  const isCompatible = currentTargetVersion === tanStackReactQueryMajorVersion
  const suspensiveAPIs = getTargetSuspensiveReactQueryAPIs()
  const exportAPIs = getExportAPIsWithoutSuspensive()

  const table = new Table({
    head: [packageJson.name, 'status', 'result'],
    style: { head: [] },
    colWidths: [36, 10, 40],
    wordWrap: true,
  })

  table.push(['version', '🟢', packageJson.version])
  table.push([
    `exports from @suspensive/react-query-${currentTargetVersion}@${targetSuspensiveReactQueryPackageJson.version}`,
    isCompatible ? '🟢' : '❌',
    suspensiveAPIs.join(', '),
  ])
  table.push([
    `exports from @tanstack/react-query@${tanStackReactQueryPackageJson.version}`,
    isCompatible ? '🟢' : '❌',
    exportAPIs.length > 0 ? exportAPIs.join(', ') : '-',
  ])
  if (!isCompatible) {
    table.push([{ content: `You should \`npx srq switch ${tanStackReactQueryMajorVersion}\` to fix this`, colSpan: 3 }])
  }

  return table.toString()
}
