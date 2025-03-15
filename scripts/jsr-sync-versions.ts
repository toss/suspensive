import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import execa from 'execa'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const packagesDir = path.join(rootDir, 'packages')

async function syncJsrVersions() {
  const packageDirs = fs.readdirSync(packagesDir)

  for (const dir of packageDirs) {
    const packagePath = path.join(packagesDir, dir)
    const packageJsonPath = path.join(packagePath, 'package.json')
    const jsrJsonPath = path.join(packagePath, 'jsr.json')

    if (fs.existsSync(packageJsonPath) && fs.existsSync(jsrJsonPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
        if (packageJson.private) {
          continue
        }

        const jsrJson = JSON.parse(fs.readFileSync(jsrJsonPath, 'utf8'))

        if (jsrJson.version !== packageJson.version) {
          console.log(`Updating ${packageJson.name} JSR version from ${jsrJson.version} to ${packageJson.version}`)
          jsrJson.version = packageJson.version

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
  }

  console.log('JSR version sync completed')
}

syncJsrVersions().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
