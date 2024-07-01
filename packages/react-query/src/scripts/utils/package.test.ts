import tanStackReactQueryPackageJson from '@tanstack/react-query/package.json'
import packageJson from '../../../package.json'
import { getPackageJson, getTanStackReactQueryPackageJson } from './package'

describe('package', () => {
  it('should get package json', () => {
    const result = getPackageJson()

    expect(result).toBeDefined()
    expect(result.name).toBe(packageJson.name)
    expect(result.description).toBe(packageJson.description)
    expect(result.version).toBe(packageJson.version)
  })

  it('should get TanStack React Query package json', () => {
    const result = getTanStackReactQueryPackageJson()

    expect(result).toBeDefined()
    expect(result.name).toBe(tanStackReactQueryPackageJson.name)
    expect(result.description).toBe(tanStackReactQueryPackageJson.description)
    expect(result.version).toBe(tanStackReactQueryPackageJson.version)
  })
})
