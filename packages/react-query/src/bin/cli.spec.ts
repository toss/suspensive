import { execFileSync } from 'node:child_process'
import path from 'node:path'
import packageJson from '../../package.json'
import { getTanStackReactQueryPackageJson } from './utils/package'
import { getStatusTable } from './utils/table'

const cliPath = path.resolve(__dirname, '../../dist/bin/cli.cjs')

describe('cli', () => {
  it('should display the correct version when using the -v flag', () => {
    const result = execFileSync('node', [cliPath, '-v']).toString().trim()

    expect(result).toBe(packageJson.version)
  })

  it('should display the help message when using the -h flag', () => {
    const result = execFileSync('node', [cliPath, '-h']).toString()

    expect(result).toContain('Usage: @suspensive/react-query [options] [command]')
  })

  it.todo('should display the status of the packages', () => {
    const result = execFileSync('node', [cliPath, 'status']).toString()
    const tanStackReactQueryPackageJson = getTanStackReactQueryPackageJson()
    const tanStackReactQueryMajorVersion = tanStackReactQueryPackageJson.version.split('.')[0]

    expect(result).toContain(getStatusTable(tanStackReactQueryMajorVersion))
  })

  it('should switch to the specified version when using the switch command', () => {
    const result = execFileSync('node', [cliPath, 'switch', '5']).toString()

    expect(result).toContain('[@suspensive/react-query] switched to version v5')
  })

  it('should fix the version to the compatible version when using the fix command', () => {
    const result = execFileSync('node', [cliPath, 'fix']).toString()

    expect(result).toContain('[@suspensive/react-query] The versions are compatible.\n')
  })
})
