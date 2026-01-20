import { logger } from './utils/logger'
import { getTanStackReactQueryPackageJson } from './utils/package'
import { switchVersion } from './utils/switchVersion'

try {
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
} catch {
  logger.log(
    'Could not detect @tanstack/react-query version. Using default v5 exports. ' +
      'If you use v4, run "npx srq fix" or import from "@suspensive/react-query-4" directly.'
  )
}
