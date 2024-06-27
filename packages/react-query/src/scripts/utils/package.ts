import { exit } from 'process'
import { loadModule } from './loadModule'

type PackageJson = {
  name: string
  description: string
  version: string
}

export function getPackageJson() {
  const packageJson = loadModule<PackageJson>('@suspensive/react-query/package.json')
  if (!packageJson) {
    console.warn('@suspensive/react-query `package.json` is not found.')
    exit(1)
  }

  return packageJson
}

export function getTanStackReactQueryPackageJson() {
  const packageJson = loadModule<PackageJson>('@tanstack/react-query/package.json')
  if (!packageJson) {
    console.warn('@tanstack/react-query is not found. Please install @tanstack/react-query.')
    exit(1)
  }

  return packageJson
}

export function getSuspensiveReactQueryPackageName() {
  const { packageName } = loadModule('@suspensive/react-query') as { packageName: string }

  return packageName
}
