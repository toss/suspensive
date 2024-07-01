import fs from 'fs'
import { copy } from './copy'

describe('copy', () => {
  beforeEach(() => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['v4.js' as unknown as fs.Dirent, 'v5.js' as unknown as fs.Dirent])
    vi.spyOn(fs, 'readFileSync').mockReturnValue(`export * from '@suspensive/react-query-4'`)
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
