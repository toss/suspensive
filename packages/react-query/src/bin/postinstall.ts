import { getTanStackReactQueryPackageJson } from './utils/package'
import { switchVersion } from './utils/switchVersion'

try {
  const { version } = getTanStackReactQueryPackageJson()

  if (!version) {
    throw new Error()
  }

  if (version.startsWith('4.')) {
    switchVersion(4)
  } else if (version.startsWith('5.')) {
    switchVersion(5)
  } else {
    console.warn('[@suspensive/react-query]', `version v${version} is not supported.`)
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (error) {
  console.error('[@suspensive/react-query]', 'not fond @tanstack/react-query')
  process.exit(1)
}
