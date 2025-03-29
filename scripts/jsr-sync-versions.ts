import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import execa from 'execa'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const packagesDir = path.join(rootDir, 'packages')

const SUSPENSIVE_SCOPE = '@suspensive'

function convertToJsrCompatibleVersion(version: string): string {
  if (version.includes('||')) {
    const versions = version.split('||')
    return versions[versions.length - 1].trim()
  }

  if (version === '*') {
    return 'latest'
  }

  return version
}

function getPackageDirFromName(name: string): string {
  if (name.startsWith(SUSPENSIVE_SCOPE)) {
    return name.substring(SUSPENSIVE_SCOPE.length)
  }
  return name
}

function getLatestPackageVersion(packageName: string): string | null {
  const dirName = getPackageDirFromName(packageName)
  const packagePath = path.join(packagesDir, dirName, '/package.json')

  if (!fs.existsSync(packagePath)) {
    return null
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
    return packageJson.version
  } catch (error) {
    console.error(`Error reading package.json for ${packageName}: ${error}`)
    return null
  }
}

function convertWorkspaceDependency(name: string, version: string): string {
  if (!version.startsWith('workspace:')) {
    const jsrCompatibleVersion = convertToJsrCompatibleVersion(version)
    return `npm:${name}@${jsrCompatibleVersion}`
  }

  const packageName = name.startsWith('@') ? name : `${SUSPENSIVE_SCOPE}/${name}`
  const versionPart = version.substring('workspace:'.length)

  if (versionPart === '*') {
    const latestVersion = getLatestPackageVersion(packageName)
    if (latestVersion) {
      return `jsr:${packageName}@${latestVersion}`
    }
    return `jsr:${packageName}`
  }

  return `jsr:${packageName}@${versionPart}`
}

function updateImports(imports: Record<string, string>, dependencies?: Record<string, string>): boolean {
  if (dependencies == null) {
    return false
  }

  let updated = false

  for (const [name, version] of Object.entries(dependencies)) {
    const importKey = name
    const importValue = convertWorkspaceDependency(name, version)

    if (imports[importKey] != null || imports[importKey] !== importValue) {
      imports[importKey] = importValue
      updated = true
    }
  }

  return updated
}

async function syncJsrVersions(): Promise<void> {
  const packageDirs = fs.readdirSync(packagesDir)

  for (const dir of packageDirs) {
    const packagePath = path.join(packagesDir, dir)
    const packageJsonPath = path.join(packagePath, 'package.json')
    const jsrJsonPath = path.join(packagePath, 'jsr.json')

    if (!fs.existsSync(packageJsonPath) || !fs.existsSync(jsrJsonPath)) {
      continue
    }

    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
      if (packageJson.private) {
        continue
      }

      const jsrJson = JSON.parse(fs.readFileSync(jsrJsonPath, 'utf8'))
      let isUpdated = false

      if (jsrJson.version !== packageJson.version) {
        jsrJson.version = packageJson.version
        isUpdated = true
      }

      const imports = jsrJson.imports || {}

      const importsUpdated = updateImports(imports, {
        ...(packageJson.dependencies || {}),
        ...(packageJson.peerDependencies || {}),
      })

      if (importsUpdated) {
        jsrJson.imports = imports
        isUpdated = true
      }

      if (isUpdated) {
        fs.writeFileSync(jsrJsonPath, JSON.stringify(jsrJson, null, 2) + '\n')

        await execa('npx', ['prettier', '--write', jsrJsonPath], {
          cwd: rootDir,
          stdio: 'inherit',
        })
      }
    } catch (error) {
      console.error(`Error processing ${dir}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  console.log('JSR version and imports sync completed')
}

syncJsrVersions().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
