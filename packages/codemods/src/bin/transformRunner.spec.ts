import fs from 'node:fs'
import path from 'node:path'
import { jscodeshiftExecutable, transformRunner, transformerDirectory } from './transformRunner'

let mockExecaReturnValue: { failed: boolean; exitCode: number }

vi.mock('execa', () => ({
  default: () => {
    if (mockExecaReturnValue.failed) {
      const error = new Error(`jscodeshift exited with code ${mockExecaReturnValue.exitCode}`)
      ;(error as any).exitCode = mockExecaReturnValue.exitCode
      throw error
    }
    return { failed: false, exitCode: 0 }
  },
}))

describe('transformRunner', () => {
  beforeEach(() => {
    mockExecaReturnValue = { failed: false, exitCode: 0 }
    console.log = vi.fn()
  })

  it('finds transformer directory', () => {
    const status = fs.lstatSync(transformerDirectory)
    expect(status).toBeTruthy()
  })

  it('finds jscodeshift executable', () => {
    const status = fs.lstatSync(jscodeshiftExecutable)
    expect(status).toBeTruthy()
  })

  it('runs jscodeshift for the given transformer', async () => {
    await transformRunner('tanstack-query-import', 'src')
    expect(console.log).toBeCalledWith(
      `Executing command: jscodeshift --no-babel --ignore-pattern=**/node_modules/** --ignore-pattern=**/.next/** --extensions=tsx,ts,jsx,js --transform ${path.join(
        transformerDirectory,
        'tanstack-query-import.cjs'
      )} src`
    )
  })

  it('rethrows jscodeshift errors', async () => {
    mockExecaReturnValue = { failed: true, exitCode: 1 }
    await expect(transformRunner('test', 'src')).rejects.toThrowError('process.exit unexpectedly called with "1"')
  })
})
