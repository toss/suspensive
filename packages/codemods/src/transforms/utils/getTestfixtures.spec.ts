import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Mock } from 'vitest'
import { getTestfixtures } from './getTestfixtures'

vi.mock('node:fs', () => ({
  readFileSync: vi.fn(),
}))

const mockReadFileSync = readFileSync as Mock

describe('getTestfixtures', () => {
  const mockInput = 'mock input content'
  const mockOutput = 'mock output content'
  const transformName = 'sampleTransform'
  const extension = 'js'
  const FIXTURE_DIR = join(__dirname, '../testfixtures', transformName)
  const inputPath = join(FIXTURE_DIR, `${transformName}.input.${extension}`)
  const outputPath = join(FIXTURE_DIR, `${transformName}.output.${extension}`)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should correctly read input and output fixture files', () => {
    mockReadFileSync.mockImplementation((filePath: string) => {
      if (filePath === inputPath) return mockInput
      if (filePath === outputPath) return mockOutput
      return ''
    })

    const result = getTestfixtures(transformName, extension)

    expect(result).toEqual({
      input: mockInput,
      expectedOutput: mockOutput,
      testName: transformName,
    })
    expect(mockReadFileSync).toHaveBeenCalledWith(inputPath, 'utf8')
    expect(mockReadFileSync).toHaveBeenCalledWith(outputPath, 'utf8')
  })

  it('should correctly read input and output fixture files with default "js" extension', () => {
    mockReadFileSync.mockImplementation((filePath: string) => {
      if (filePath === inputPath) return mockInput
      if (filePath === outputPath) return mockOutput
      return ''
    })

    const result = getTestfixtures(transformName)

    expect(result).toEqual({
      input: mockInput,
      expectedOutput: mockOutput,
      testName: transformName,
    })
    expect(mockReadFileSync).toHaveBeenCalledWith(inputPath, 'utf8')
    expect(mockReadFileSync).toHaveBeenCalledWith(outputPath, 'utf8')
  })

  it('should throw an error if input file is missing', () => {
    mockReadFileSync.mockImplementation((filePath: string) => {
      if (filePath === outputPath) return mockOutput
      throw new Error('File not found')
    })

    expect(() => getTestfixtures(transformName, extension)).toThrow('File not found')
  })

  it('should throw an error if output file is missing', () => {
    mockReadFileSync.mockImplementation((filePath: string) => {
      if (filePath === inputPath) return mockInput
      throw new Error('File not found')
    })

    expect(() => getTestfixtures(transformName, extension)).toThrow('File not found')
  })
})
