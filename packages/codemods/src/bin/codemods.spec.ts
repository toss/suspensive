import { execFileSync } from 'node:child_process'
import path from 'node:path'
import packageJson from '../../package.json'

const codemodsPath = path.resolve(__dirname, '../../dist/bin/codemods.cjs')

describe('codemods', () => {
  it('should display the correct version when using the -v flag', () => {
    const result = execFileSync('node', [codemodsPath, '-v']).toString().trim()

    expect(result).toBe(packageJson.version)
  })

  it('should display the help message when using the -h flag', () => {
    const result = execFileSync('node', [codemodsPath, '-h']).toString()

    expect(result).toContain('Usage: @suspensive/codemods [codemod] [path]')
  })
})
