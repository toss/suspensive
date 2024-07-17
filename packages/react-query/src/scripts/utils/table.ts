import Table from 'cli-table3'
import { getPackageJson, getTanStackReactQueryPackageJson } from './package'

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

export function getStatusTable(currentVersion: string) {
  const packageJson = getPackageJson()
  const tanStackReactQueryPackageJson = getTanStackReactQueryPackageJson()
  const tanStackReactQueryMajorVersion = tanStackReactQueryPackageJson.version.split('.')[0]

  const table = new Table({
    head: ['', 'result', 'status', 'advice'],
    style: { head: [] },
  })

  console.log(tanStackReactQueryMajorVersion)

  table.push(['version', `@suspensive/react-query@${packageJson.version}`, '🟢', ''])
  table.push(['export', `@suspensive/react-query-${currentVersion}@${packageJson.version}`, '🟢', ''])
  table.push([
    'peerDependency',
    `@tanstack/react-query@${tanStackReactQueryPackageJson.version}`,
    currentVersion === tanStackReactQueryMajorVersion ? '🟢' : '❌',
    currentVersion === tanStackReactQueryMajorVersion
      ? 'The versions are compatible.'
      : `Install @tanstack/react-query@${tanStackReactQueryMajorVersion} or\n execute suspensive-react-query switch ${tanStackReactQueryMajorVersion} to match\n @suspensive/react-query version with\n @tanstack/react-query`,
  ])
  table.push(['You can use', currentVersion === '5' ? VERSION5_APIS.join('\n') : VERSION4_APIS.join('\n'), '🟢', ''])

  return table.toString()
}
