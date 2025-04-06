import execa from 'execa'
import * as path from 'path'
import * as fs from 'fs'

export interface JsrResult {
  packageName: string
  success: boolean
}

type PackageInfo = {
  name: string
  dir: string
  dependencies: string[]
}
export function loadPackages(workspaceRoot: string): PackageInfo[] {
  const packages: PackageInfo[] = []

  const dirs = fs
    .readdirSync(workspaceRoot, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => path.join(workspaceRoot, dirent.name))

  for (const dir of dirs) {
    const filePath = path.join(dir, 'jsr.json')
    if (!fs.existsSync(filePath)) continue

    const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    const name = json.name as string
    const imports = json.imports ?? {}

    const dependencies = Object.keys(imports).filter((dep) => dep.startsWith(name.split('/')[0]))

    packages.push({ name, dir, dependencies })
  }

  return packages
}

export function sortPackages(packages: PackageInfo[]): PackageInfo[] {
  const nameToPkg = new Map(packages.map((p) => [p.name, p]))
  const visited = new Set<string>()
  const temp = new Set<string>()
  const result: PackageInfo[] = []

  function visit(name: string) {
    if (visited.has(name)) return
    if (temp.has(name)) throw new Error(`Cycle detected: ${name}`)
    temp.add(name)

    const pkg = nameToPkg.get(name)
    if (!pkg) throw new Error(`Unknown package: ${name}`)

    for (const dep of pkg.dependencies) {
      if (nameToPkg.has(dep)) {
        visit(dep)
      }
    }

    temp.delete(name)
    visited.add(name)
    result.push(pkg)
  }

  for (const pkg of packages) {
    visit(pkg.name)
  }

  return result
}

export async function executeJsrCommand({
  packagePath,
  isDryRun,
}: {
  packagePath: string
  isDryRun: boolean
}): Promise<JsrResult> {
  const packageDir = path.dirname(packagePath)
  const packageName = path.basename(packageDir)

  console.log(`\n===== ${isDryRun ? 'Testing' : 'Publishing'} JSR in ${packageName} =====`)

  try {
    const args = ['dlx', 'jsr', 'publish']
    if (isDryRun) {
      args.push('--dry-run', '--allow-slow-types', '--allow-dirty')
    } else {
      args.push('--allow-slow-types')
    }

    await execa('pnpm', args, {
      cwd: packageDir,
      stdio: 'inherit',
    })

    return { packageName, success: true }
  } catch (error) {
    console.error(`Error in ${packageName}:`, error.message || error)
    return { packageName, success: false }
  }
}

export function writeResultsToLog(results: JsrResult[], isDryRun: boolean): void {
  const totalPackages = results.length
  const successCount = results.filter((r) => r.success).length
  const failedCount = totalPackages - successCount

  console.log(`\n===== JSR ${isDryRun ? 'Test' : 'Publish'} Results =====`)
  console.log(`Total packages: ${totalPackages}`)
  console.log(`Successful: ${successCount} packages`)

  if (failedCount > 0) {
    console.log(`Failed: ${failedCount} packages`)

    console.log('\nFailed packages:')
    results
      .filter((r) => !r.success)
      .forEach((result) => {
        console.log(`FAILED: ${result.packageName}`)
      })

    console.error('\nJSR command failed for one or more packages. Exiting with error code 1.')
    process.exit(1)
  } else {
    console.log('All packages processed successfully!')
  }
}
