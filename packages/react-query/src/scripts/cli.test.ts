import { execSync } from 'child_process'
import path from 'path'
import packageJson from '../../package.json'

const cliPath = path.resolve(__dirname, '../../dist/scripts/cli.cjs')
const command = (command: string) => `node ${cliPath} ${command}`

describe('cli', () => {
  it('should display the correct version when using the -v flag', () => {
    const result = execSync(command('-v')).toString()
    expect(result.trim()).toBe(packageJson.version)
  })

  it('should display the help message when using the -h flag', () => {
    const result = execSync(command('-h')).toString()
    expect(result).toContain('Usage: @suspensive/react-query [options] [command]')
  })

  it('should display the status of the packages', () => {
    const result = execSync(command('status')).toString()
    expect(result).toContain(`[@suspensive/react-query] v2.3.0 (4)\n[@tanstack/react-query] v4.36.1`)
  })

  it('should switch to the specified version when using the switch command', () => {
    const result = execSync(command('switch 5')).toString()
    expect(result).toContain('[@suspensive/react-query] switched to version v5')
  })

  it('should fix the version to the compatible version when using the fix command', () => {
    const result = execSync(command('fix')).toString()
    expect(result).toContain(
      '[@suspensive/react-query] Switching to the compatible version...\n[@suspensive/react-query] switched to version v4'
    )
  })
})
