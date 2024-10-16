import { type PackageJson, getTargetSuspensiveReactQueryVersion, loadModule } from './package'
import { switchVersion } from './switchVersion'
import { getStatusTable } from './table'

export const statusAction = () => {
  const targetSuspensiveReactQueryVersion = getTargetSuspensiveReactQueryVersion()

  console.log(getStatusTable(targetSuspensiveReactQueryVersion))
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
  const tanStackReactQueryPackageJsonModule = loadModule<PackageJson>('@tanstack/react-query/package.json')
  assert(
    tanStackReactQueryPackageJsonModule.isSuccess,
    '@tanstack/react-query is not found. Please install @tanstack/react-query.'
  )

  const suspensiveReactQueryVersion = getTargetSuspensiveReactQueryVersion()

  if (suspensiveReactQueryVersion === tanStackReactQueryPackageJsonModule.exports.version.split('.')[0]) {
    console.log('[@suspensive/react-query]', `The versions are compatible.`)
  } else {
    console.log('[@suspensive/react-query]', `Switching to the compatible version...`)
    switchVersion(Number(tanStackReactQueryPackageJsonModule.exports.version.split('.')[0]))
  }
}
