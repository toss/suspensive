import { load } from './Load'

describe('load', () => {
  it('should load image by src', async () => {
    const loadedImage = await load('https://placehold.co/200x100')
    expect(loadedImage.src).toBe('https://placehold.co/200x100')
  })
  it('should throw error if image fails to load', async () => {
    const invalidSrc = 'https://invalid-url'
    await expect(load(invalidSrc)).rejects.toThrow('image error occurred during loading')
  })
})
