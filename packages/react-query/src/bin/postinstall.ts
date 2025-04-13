import { logger } from './utils/logger'
import { getTanStackReactQueryPackageJson } from './utils/package'
import { switchVersion } from './utils/switchVersion'

const { version } = getTanStackReactQueryPackageJson()

const major = version.split('.')[0]

switch (major) {
  case '4':
    switchVersion(4)
    break
  case '5':
    switchVersion(5)
    break
  default:
    logger.error(`version v${version} is not supported.`)
    break
}