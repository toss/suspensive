import { findJsrPackages, executeJsrCommand, writeResultsToLog, JsrResult } from './jsr-utils'

async function main() {
  const packages = await findJsrPackages()
  const results: JsrResult[] = []

  for (const pkg of packages) {
    const result = await executeJsrCommand({ packagePath: pkg, isDryRun: false })
    results.push(result)
  }
  writeResultsToLog(results, false)
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
