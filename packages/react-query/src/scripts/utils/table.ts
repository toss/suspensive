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
  const peerDependencyDescription = exportAPIs.length > 0 ? `You can use ${exportAPIs.join(', ')}` : ''

  const table = new Table({
    head: [packageJson.name, 'result', 'status', 'description'],
    style: { head: [] },
  })

  table.push(['version', packageJson.version, '🟢'])
  table.push([
    'export',
    `@suspensive/react-query-${currentTargetVersion}@${targetSuspensiveReactQueryPackageJson.version}`,
    '🟢',
    `You can use ${suspensiveAPIs.join(', ')}`,
  ])
  table.push([
    'peerDependency',
    `@tanstack/react-query@${tanStackReactQueryPackageJson.version}`,
    isCompatible ? '🟢' : '❌',
    isCompatible
      ? peerDependencyDescription
      : `You should npx srq switch ${tanStackReactQueryMajorVersion} to fix this error`,
  ])

  return table.toString()
}
