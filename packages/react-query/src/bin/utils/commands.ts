import { logger } from './logger'
import { getTanStackReactQueryPackageJson, getTargetSuspensiveReactQueryVersion } from './package'
import { switchVersion } from './switchVersion'
import { getStatusTable } from './table'

export function statusAction() {
  const targetSuspensiveReactQueryVersion = getTargetSuspensiveReactQueryVersion()
  if (!targetSuspensiveReactQueryVersion) {
    logger.error('The version is not found.')
    return
  }

  console.log(getStatusTable(targetSuspensiveReactQueryVersion))
}

export function switchAction(version: string) {
  if (version === '4') {
    switchVersion(4)
  } else if (version === '5') {
    switchVersion(5)
  } else {
    console.warn('[@suspensive/react-query]', `version v${version} is not supported.`)
  }
}

export function fixAction() {
  const tanStackReactQueryPackageJson = getTanStackReactQueryPackageJson()
  const targetSuspensiveReactQueryVersion = getTargetSuspensiveReactQueryVersion()

  const tanStackReactQueryMajorVersion = tanStackReactQueryPackageJson.version.split('.')[0]
  if (targetSuspensiveReactQueryVersion === tanStackReactQueryMajorVersion) {
    logger.log('The versions are compatible.')
  } else {
    logger.log('Switching to the compatible version...')
    switchVersion(Number(tanStackReactQueryMajorVersion))
  }
}
