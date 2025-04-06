import { executeJsrCommand, writeResultsToLog, JsrResult, loadPackages, sortPackages } from './jsr-utils'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const workspaceRoot = path.resolve(__dirname, '../packages')

async function main() {
  const packageInfos = loadPackages(workspaceRoot)
  const results: JsrResult[] = []

  const sortedPackages = sortPackages(packageInfos)

  for (const { dir } of sortedPackages) {
    const result = await executeJsrCommand({ packagePath: dir, isDryRun: false })
    results.push(result)
  }
  writeResultsToLog(results, false)
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
