import { findJsrPackages, executeJsrCommand, writeResultsToLog } from './jsr-utils'

async function main() {
  const packages = await findJsrPackages()
  const resultPromises = packages.map((pkg) => executeJsrCommand(pkg, false))
  const results = await Promise.all(resultPromises)
  writeResultsToLog(results, false)
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
