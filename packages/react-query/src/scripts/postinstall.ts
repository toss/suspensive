import { loadModule } from './utils/loadModule'
import { switchVersion } from './utils/switchVersion'

interface PackageJson {
  version?: string
}

const reactQueryPackageJson = loadModule<PackageJson>('@tanstack/react-query/package.json')
const version: string | undefined = reactQueryPackageJson?.version

if (!version) {
  console.warn('@tanstack/react-query is not found.')
} else if (version.startsWith('4.')) {
  switchVersion(4)
} else if (version.startsWith('5.')) {
  switchVersion(5)
} else {
  console.warn('[@suspensive/react-query]', `version v${version} is not supported.`)
}
