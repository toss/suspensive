import { load } from './Load'

describe('load', () => {
  it('should load image by src', async () => {
    const loadedImage = await load('https://placehold.co/200x100')
    expect(loadedImage.src).toBe('https://placehold.co/200x100')
  })
})
