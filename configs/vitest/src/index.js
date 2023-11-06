import fs from 'fs'
import path, { dirname } from 'path'

/**
 * @param {import('vitest').UserConfig} userConfig
 * @returns {import('vitest').UserConfig}
 */
export const forPackage = (userConfig) => {
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
