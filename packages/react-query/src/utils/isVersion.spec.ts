import { isVersion } from './isVersion'

describe('isVersion', () => {
  it('should check the version correctly', () => {
    expect(isVersion(4).of('4.32.1')).toBe(true)
    expect(isVersion(4).of('5.32.1')).toBe(false)
    expect(isVersion(4).of('3.32.1')).toBe(false)

    expect(isVersion(4).of('4.32.1-beta.32')).toBe(true)
    expect(isVersion(4).of('5.32.1-beta.32')).toBe(false)
    expect(isVersion(4).of('3.32.1-beta.32')).toBe(false)

    expect(isVersion(4).of('4')).toBe(true)
    expect(isVersion(4).of('5')).toBe(false)
    expect(isVersion(4).of('3')).toBe(false)
  })
})
