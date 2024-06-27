import { getTanStackReactQueryPackageJson } from './utils/package'
import { switchVersion } from './utils/switchVersion'

const { version } = getTanStackReactQueryPackageJson()

if (version.startsWith('4.')) {
  switchVersion(4)
} else if (version.startsWith('5.')) {
  switchVersion(5)
} else {
  console.warn('[@suspensive/react-query]', `version v${version} is not supported.`)
}
