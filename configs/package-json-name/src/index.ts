import fs from 'fs'
import path, { dirname } from 'path'

export const packageJsonName = () => {
  const packageJson = JSON.parse(fs.readFileSync(path.resolve(dirname('.'), 'package.json'), 'utf-8'))
  return packageJson.name as string
}
