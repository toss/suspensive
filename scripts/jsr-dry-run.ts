import { findJsrPackages, executeJsrCommand, writeResultsToLog } from './jsr-utils'

async function main() {
  const packages = await findJsrPackages()
  const resultPromises = packages.map((pkg) => executeJsrCommand(pkg, true))
  const results = await Promise.all(resultPromises)
  writeResultsToLog(results, true)
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
