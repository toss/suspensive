import { execFileSync } from 'child_process'
import path from 'path'
import tanstackReactQueryPackageJson from '@tanstack/react-query/package.json'
import packageJson from '../../package.json'

const cliPath = path.resolve(__dirname, '../../dist/scripts/cli.cjs')

describe('cli', () => {
  it('should display the correct version when using the -v flag', () => {
    const result = execFileSync('node', [cliPath, '-v']).toString().trim()

    expect(result).toBe(packageJson.version)
  })

  it('should display the help message when using the -h flag', () => {
    const result = execFileSync('node', [cliPath, '-h']).toString()

    expect(result).toContain('Usage: @suspensive/react-query [options] [command]')
  })

  it('should display the status of the packages', () => {
    const result = execFileSync('node', [cliPath, 'status']).toString()

    expect(result).toContain(
      `[@suspensive/react-query] v${packageJson.version} (4)\n[@tanstack/react-query] v${tanstackReactQueryPackageJson.version}`
    )
  })

  it('should switch to the specified version when using the switch command', () => {
    const result = execFileSync('node', [cliPath, 'switch', '5']).toString()

    expect(result).toContain('[@suspensive/react-query] switched to version v5')
  })

  it('should fix the version to the compatible version when using the fix command', () => {
    const result = execFileSync('node', [cliPath, 'fix']).toString()

    expect(result).toContain(
      '[@suspensive/react-query] Switching to the compatible version...\n[@suspensive/react-query] switched to version v4'
    )
  })
})
