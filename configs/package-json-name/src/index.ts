import fs from 'fs'
import path, { dirname } from 'path'

export const packageJsonName = () => {
  const packageJson = JSON.parse(fs.readFileSync(path.resolve(dirname('.'), 'package.json'), 'utf-8')) as {
    name: string
  }
  return packageJson.name
}
