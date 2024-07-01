import fs from 'fs'
import { copy } from './copy'

vi.mock('fs', async () => {
  const actual = await vi.importActual<typeof fs>('fs')
  return {
    ...actual,
    readdirSync: vi.fn(),
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
  }
})

describe('copy', () => {
  const files = ['v4.js' as unknown as fs.Dirent, 'v5.js' as unknown as fs.Dirent]
  const fileContent = `export * from '@suspensive/react-query-4'`

  beforeEach(() => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue(files)
    vi.spyOn(fs, 'readFileSync').mockReturnValue(fileContent)
    vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return false if directory does not include dist or no files are found', () => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue([])

    expect(copy(4)).toBe(false)
  })

  it('should copy and replace files with the specified version', () => {
    expect(copy(5)).toBe(true)
  })
})
