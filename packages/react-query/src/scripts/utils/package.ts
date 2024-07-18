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

export function getSuspensiveReactQueryPackageJson(targetVersion: string) {
  let packageJson: PackageJson | undefined

  switch (targetVersion) {
    case '4':
      packageJson = loadModule<PackageJson>('@suspensive/react-query-4/package.json')
      break
    case '5':
      packageJson = loadModule<PackageJson>('@suspensive/react-query-5/package.json')
      break
    default:
      console.warn(`@suspensive/react-query-${targetVersion} is not found.`)
      exit(1)
  }

  if (!packageJson) {
    console.warn(`@suspensive/react-query-${targetVersion} is not found.`)
    exit(1)
  }

  return packageJson
}
