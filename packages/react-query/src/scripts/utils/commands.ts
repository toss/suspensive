import fs from 'fs'
import path from 'path'
import Table from 'cli-table3'
import { getPackageJson, getTanStackReactQueryPackageJson } from './package'
import { switchVersion } from './switchVersion'

export const version5APIs = [
  '<SuspenseQuery/>',
  '<SuspenseQueries/>',
  '<SuspenseInfiniteQuery/>',
  '<Mutation/>',
  '<QueryErrorBoundary/>',
]

export const version4APIs = [
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

export const getSuspensiveReactQueryVersion = (): string => {
  const indexFileContent = fs.readFileSync(path.join(__dirname, '../../dist/index.js'), 'utf-8')
  return (RegExp(/@suspensive\/react-query-(\d+)/).exec(indexFileContent) || [])[1] || 'not found'
}

export const statusAction = () => {
  const packageJson = getPackageJson()
  const tanStackReactQueryPackageJson = getTanStackReactQueryPackageJson()
  const suspensiveReactQueryVersion = getSuspensiveReactQueryVersion()
  const tanStackReactQueryMajorVersion = tanStackReactQueryPackageJson.version.split('.')[0]

  const table = new Table({
    head: ['', 'result', 'status', 'advice'],
    style: { head: [] },
  })

  table.push(['version', `@suspensive/react-query@${packageJson.version}`, '🟢', ''])
  table.push(['export', `@suspensive/react-query-${suspensiveReactQueryVersion}@${packageJson.version}`, '🟢', ''])
  table.push([
    'peerDependency',
    `@tanstack/react-query@${tanStackReactQueryPackageJson.version}`,
    suspensiveReactQueryVersion === tanStackReactQueryMajorVersion ? '🟢' : '❌',
    suspensiveReactQueryVersion === tanStackReactQueryMajorVersion
      ? 'The versions are compatible.'
      : `Install @tanstack/react-query@${tanStackReactQueryMajorVersion} or execute suspensive-react-query switch ${tanStackReactQueryMajorVersion} to match @suspensive/react-query version with @tanstack/react-query`,
  ])
  table.push([
    'You can use',
    suspensiveReactQueryVersion === '5' ? version5APIs.join('\n') : version4APIs.join('\n'),
    '🟢',
    '',
  ])

  console.log(table.toString())
}

export const switchAction = (version: string) => {
  if (version === '4') {
    switchVersion(4)
  } else if (version === '5') {
    switchVersion(5)
  } else {
    console.warn('[@suspensive/react-query]', `version v${version} is not supported.`)
  }
}

export const fixAction = () => {
  const tanStackReactQueryPackageJson = getTanStackReactQueryPackageJson()
  const suspensiveReactQueryVersion = getSuspensiveReactQueryVersion()

  const tanStackReactQueryMajorVersion = tanStackReactQueryPackageJson.version.split('.')[0]
  if (suspensiveReactQueryVersion === tanStackReactQueryMajorVersion) {
    console.log('[@suspensive/react-query]', `The versions are compatible.`)
  } else {
    console.log('[@suspensive/react-query]', `Switching to the compatible version...`)
    switchVersion(Number(tanStackReactQueryMajorVersion))
  }
}
