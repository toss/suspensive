import Table from 'cli-table3'
import { getPackageJson, getSuspensiveReactQueryPackageJson, getTanStackReactQueryPackageJson } from './package'

export const VERSION5_APIS = [
  '<SuspenseQuery/>',
  '<SuspenseQueries/>',
  '<SuspenseInfiniteQuery/>',
  '<Mutation/>',
  '<QueryErrorBoundary/>',
]

export const VERSION4_APIS = [
  'useSuspenseQuery',
  'useSuspenseQueries',
  'useSuspenseInfiniteQuery',
  'queryOptions',
  'infiniteQueryOptions',
  '<SuspenseQuery/>',
  '<SuspenseQueries/>',
  '<SuspenseInfiniteQuery/>',
  '<Mutation/>',
  '<QueryErrorBoundary/>',
]

export function getStatusTable(currentTargetVersion: string) {
  const packageJson = getPackageJson()
  const tanStackReactQueryPackageJson = getTanStackReactQueryPackageJson()
  const tanStackReactQueryMajorVersion = tanStackReactQueryPackageJson.version.split('.')[0]
  const targetSuspensiveReactQueryPackageJson = getSuspensiveReactQueryPackageJson(tanStackReactQueryMajorVersion)

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
      : `Install @tanstack/react-query@${tanStackReactQueryMajorVersion} or\n execute suspensive-react-query switch ${tanStackReactQueryMajorVersion} to match\n @suspensive/react-query version with\n @tanstack/react-query`,
  ])
  table.push([
    'You can use',
    currentTargetVersion === '5' ? VERSION5_APIS.join('\n') : VERSION4_APIS.join('\n'),
    '🟢',
    'For more detailed information about the provided APIs,\nplease visit the official documentation:\nhttps://suspensive.org/links/react-query',
  ])

  return table.toString()
}
