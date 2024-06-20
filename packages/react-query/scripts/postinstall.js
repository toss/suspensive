import { loadModule, switchVersion } from './utils.js'

const reactQueryPackageJson = loadModule('@tanstack/react-query/package.json')
const version = reactQueryPackageJson?.version

if (!version || typeof version !== 'string') {
  console.warn('@tanstack/react-query is not found.')
} else if (version.startsWith('4.')) {
  switchVersion(4)
} else if (version.startsWith('5.')) {
  switchVersion(5)
} else {
  console.warn('[@suspensive/react-query]', `version v${version} is not supported.`)
}
