import { coerce, parse } from 'semver'
import { logger } from './utils/logger'
import { getTanStackReactQueryPackageJson } from './utils/package'
import { switchVersion } from './utils/switchVersion'

const tanStackReactQueryPackageJson = getTanStackReactQueryPackageJson()

const semver = parse(coerce(tanStackReactQueryPackageJson.version))

console.log(tanStackReactQueryPackageJson.version, semver)

if (!semver) {
  logger.error(`@tanstack/react-query@${tanStackReactQueryPackageJson.version} is not semver.`)
  process.exit(1)
}

switch (semver.major) {
  case 4:
    switchVersion(4)
    break
  case 5:
    switchVersion(5)
    break
  default:
    logger.error(`@tanstack/react-query@${tanStackReactQueryPackageJson.version} is not supported.`)
}
