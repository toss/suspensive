import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export function getTestfixtures(transformName: string, extension: 'js' | 'jsx' | 'ts' | 'tsx' = 'js') {
  const FIXTURE_DIR = join(__dirname, '../testfixtures', transformName)
  const inputPath = join(FIXTURE_DIR, `${transformName}.input.${extension}`)
  const outputPath = join(FIXTURE_DIR, `${transformName}.output.${extension}`)

  const input = readFileSync(inputPath, 'utf8').trim()
  const expectedOutput = readFileSync(outputPath, 'utf8').trim()

  return {
    input,
    expectedOutput,
    testName: transformName,
  }
}
