import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '../../')
const packagesDir = path.join(rootDir, 'packages')

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

        execSync(`npx prettier --write ${jsrJsonPath}`, {
          cwd: rootDir,
          stdio: 'inherit',
        })
      }
    } catch (error) {
      console.error(`Error processing ${dir}: ${error}`)
    }
  }
}

console.log('JSR version sync completed')
