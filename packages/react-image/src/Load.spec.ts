import { describe, expect, it } from 'vitest'
import { load } from './Load'

describe('load', () => {
  it('should load image by src', async () => {
    const loadedImage = await load('src/assets/test.png')
    expect(loadedImage.src).toBe('http://localhost:5173/src/assets/test.png')
  })
})
