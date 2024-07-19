import Table from 'cli-table3'
import {
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
  const targetSuspensiveReactQueryAPIs = getTargetSuspensiveReactQueryAPIs()

  const table = new Table({
    head: [packageJson.name, 'result', 'status', 'advice'],
    style: { head: [] },
  })

  table.push(['version', packageJson.version, '🟢', ''])
  table.push([
    'export',
    `@suspensive/react-query-${currentTargetVersion}@${targetSuspensiveReactQueryPackageJson.version}`,
    '🟢',
    '',
  ])
  table.push([
    'peerDependency',
    `@tanstack/react-query@${tanStackReactQueryMajorVersion}`,
    currentTargetVersion === tanStackReactQueryMajorVersion ? '🟢' : '❌',
    currentTargetVersion === tanStackReactQueryMajorVersion
      ? 'The versions are compatible.'
      : `Install @tanstack/react-query@${currentTargetVersion} or\nexecute suspensive-react-query switch ${tanStackReactQueryMajorVersion} to match\n@suspensive/react-query version with\n@tanstack/react-query`,
  ])
  table.push([
    'You can use',
    targetSuspensiveReactQueryAPIs.join('\n'),
    '🟢',
    'For more detailed information about the provided APIs,\nplease visit the official documentation:\nhttps://suspensive.org/docs/react-query/motivation',
  ])

  return table.toString()
}
