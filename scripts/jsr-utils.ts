import execa from 'execa'
import * as fs from 'fs'
import * as path from 'path'

interface JsrResult {
  packageName: string
  success: boolean
}

export async function findJsrPackages(): Promise<string[]> {
  const { stdout } = await execa('find', ['packages', '-name', 'jsr.json', '-type', 'f'])
  return stdout.trim().split('\n')
}

export async function executeJsrCommand(packagePath: string, isDryRun: boolean): Promise<JsrResult> {
  const packageDir = path.dirname(packagePath)
  const packageName = path.basename(packageDir)

  console.log(`\n===== ${isDryRun ? 'Testing' : 'Publishing'} JSR in ${packageName} =====`)

  try {
    const args = ['jsr', 'publish']

    if (isDryRun) {
      args.push('--dry-run', '--allow-slow-types', '--allow-dirty')
    } else {
      args.push('--allow-slow-types')
    }

    await execa('npx', args, {
      cwd: packageDir,
      stdio: 'inherit',
    })

    return { packageName, success: true }
  } catch (error) {
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
  } else {
    console.log('All packages processed successfully!')
  }
}
