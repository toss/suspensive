import fs from 'node:fs'
import { copy } from './copy'

describe('copy', () => {
  beforeEach(() => {
    vi.spyOn(fs, 'readFileSync').mockReturnValue(`export * from '@suspensive/react-query-4'`)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return false if directory does not include dist or no files are found', () => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue([])

    expect(copy(4)).toBe(false)
  })

  it('should copy and replace files with the specified version', () => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['v5', 'other'] as unknown as fs.Dirent<Buffer>[])
    vi.spyOn(fs, 'unlinkSync').mockReturnValue()
    vi.spyOn(fs, 'writeFileSync').mockReturnValue()

    expect(copy(5)).toBe(true)
    expect(fs.readdirSync).toHaveBeenCalledTimes(1)
    expect(fs.readFileSync).toHaveBeenCalledTimes(1)
    expect(fs.unlinkSync).toHaveBeenCalledTimes(1)
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1)
  })
})
