import { logger } from './utils/logger'
import { getPackageJson, getTanStackReactQueryPackageJson } from './utils/package'
import { switchVersion } from './utils/switchVersion'

const tanstackPackageJson = getTanStackReactQueryPackageJson()
const suspensivePackageJson = getPackageJson()

const major = tanstackPackageJson.version.split('.')[0]

switch (major) {
  case '4':
    switchVersion(4)
    break
  case '5':
    switchVersion(5)
    break
  default:
    logger.error(`version v${tanstackPackageJson.version} is not supported.`)
    break
}

logger.warn(`
  Installing @suspensive/react-query directly is deprecated.
  This package will be removed in the next major version. Only @suspensive/react-query-4 and @suspensive/react-query-5 will remain.
  Please use npm aliases to install the version-specific package instead:

  npm install @suspensive/react-query@npm:@suspensive/react-query-${major} @tanstack/react-query@${major}

  This keeps your import path as "@suspensive/react-query" while installing the correct package.
  Your package.json will look like:

  {
    "dependencies": {
      "@suspensive/react-query": "npm:@suspensive/react-query-${major}@^${suspensivePackageJson.version}"
    }
  }

  When upgrading @tanstack/react-query, just change the alias in package.json — no code changes required.

  See: https://suspensive.org/docs/react-query/installation
`)
