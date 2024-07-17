import fs from 'fs'
import path from 'path'
import { getTanStackReactQueryPackageJson } from './package'
import { switchVersion } from './switchVersion'
import { getStatusTable } from './table'

export const getSuspensiveReactQueryVersion = (): string => {
  const indexFileContent = fs.readFileSync(path.join(__dirname, '../../dist/index.js'), 'utf-8')
  return (RegExp(/@suspensive\/react-query-(\d+)/).exec(indexFileContent) || [])[1] || 'not found'
}

export const statusAction = () => {
  const suspensiveReactQueryVersion = getSuspensiveReactQueryVersion()

  console.log(getStatusTable(suspensiveReactQueryVersion))
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
