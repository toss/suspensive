import fs from 'fs'
import path, { dirname } from 'path'
import { UserConfig } from 'vitest/config'

export const forPackage = (userConfig?: UserConfig): UserConfig => {
  const packageJsonPath = path.resolve(dirname('.'), 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

  return {
    ...userConfig,
    test: {
      name: packageJson.name,
      dir: './src',
      environment: 'jsdom',
      globals: true,
      setupFiles: './test.setup.ts',
      coverage: {
        provider: 'v8',
        ...userConfig?.test?.coverage,
      },
      ...userConfig?.test,
    },
  }
}
