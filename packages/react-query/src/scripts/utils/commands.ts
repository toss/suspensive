import fs from 'fs'
import path from 'path'
import { getPackageJson, getTanStackReactQueryPackageJson } from './package'
import { switchVersion } from './switchVersion'

export const version5APIs = ['SuspenseQuery', 'SuspenseQueries', 'SuspenseInfiniteQuery', 'QueryErrorBoundary']

export const version4APIs = [
  'useSuspenseQuery',
  'useSuspenseQueries',
  'useSuspenseInfiniteQuery',
  'queryOptions',
  'infiniteQueryOptions',
  'SuspenseQuery',
  'SuspenseQueries',
  'SuspenseInfiniteQuery',
  'QueryErrorBoundary',
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

  console.log('\nSuspensive React Query status:')
  console.log(
    `@suspensive/react-query@${packageJson.version} export @suspensive/react-query-${suspensiveReactQueryVersion}'s interfaces`
  )

  const apis = suspensiveReactQueryVersion === '5' ? version5APIs : version4APIs
  apis.forEach((api) => console.log(`  - ${api}`))

  console.log(`@tanstack/react-query@${tanStackReactQueryPackageJson.version}`)

  if (suspensiveReactQueryVersion === tanStackReactQueryMajorVersion) {
    console.log(`\nThe versions are compatible.`)
  } else {
    console.log(
      '\nThe version of @suspensive/react-query is not compatible with the current version of @tanstack/react-query.',
      `\nPlease run 'npx suspensive-react-query switch ${suspensiveReactQueryVersion === '5' ? '4' : '5'}' to switch to the compatible version.`
    )
  }
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
