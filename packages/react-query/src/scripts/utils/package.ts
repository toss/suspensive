import { resolve } from 'path'
import { exit } from 'process'
import { loadModule } from './loadModule'

type PackageJson = {
  name: string
  description: string
  version: string
}

export function getPackageJson() {
  const packageJson = loadModule<PackageJson>(resolve(__dirname, '..', '..', 'package.json'))
  if (!packageJson) {
    console.warn('@suspensive/react-query `package.json` is not found.')
    exit(1)
  }

  return packageJson
}

export function getTanstackPackageJson() {
  const tanstackPackageJson = loadModule<PackageJson>('@tanstack/react-query/package.json')
  if (!tanstackPackageJson) {
    console.warn('@tanstack/react-query is not found. Please install @tanstack/react-query.')
    exit(1)
  }

  return tanstackPackageJson
}

export function getSuspensiveReactQueryVersion() {
  const { suspensiveReactQueryVersion } = loadModule('@suspensive/react-query') as {
    suspensiveReactQueryVersion: string
  }

  return suspensiveReactQueryVersion
}
