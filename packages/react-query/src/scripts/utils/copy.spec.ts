import fs from 'fs'
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
    expect(copy(5)).toBe(true)
  })
})
