import { assert } from '../utils'
import { type PackageJson, loadModule } from './utils/package'
import { switchVersion } from './utils/switchVersion'

const tanStackReactQueryPackageJsonModule = loadModule<PackageJson>('@tanstack/react-query/package.json')
assert(
  tanStackReactQueryPackageJsonModule.isSuccess,
  '@tanstack/react-query is not found. Please install @tanstack/react-query.'
)
if (tanStackReactQueryPackageJsonModule.exports.version.startsWith('4.')) {
  switchVersion(4)
} else if (tanStackReactQueryPackageJsonModule.exports.version.startsWith('5.')) {
  switchVersion(5)
} else {
  console.warn(
    '[@suspensive/react-query]',
    `version v${tanStackReactQueryPackageJsonModule.exports.version} is not supported.`
  )
}
