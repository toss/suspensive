import fs from 'fs'
import path from 'path'
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

export function getIndexFileContent() {
  const basePath = path.resolve(__dirname, '../../dist').replace(/src/, '')

  return fs.readFileSync(path.join(basePath, 'index.js'), 'utf-8') || ''
}

export function getTargetSuspensiveReactQueryVersion(): string {
  const indexFileContent = getIndexFileContent()

  return (RegExp(/@suspensive\/react-query-(\d+)/).exec(indexFileContent) || [])[1] || ''
}

export function getTargetSuspensiveReactQueryAPIs() {
  const indexFileContent = getIndexFileContent()

  const modules = [...indexFileContent.matchAll(/export \* from ['"](.+?)['"]/g)]
  const results: string[] = []

  for (const module of modules) {
    const moduleName = module[1]
    const moduleExports = loadModule<Record<string, unknown>>(moduleName)

    if (moduleExports === undefined) {
      console.warn('[@suspensive/react-query]', `Module ${moduleName} is not found`)
      exit(1)
    }

    const functions = Object.keys(moduleExports)
      .filter((key) => typeof moduleExports[key] === 'function')
      .map((fn) => (fn[0] === fn[0].toUpperCase() ? `<${fn}/>` : fn))
      .reverse()

    results.push(...functions)
  }

  return results
}
