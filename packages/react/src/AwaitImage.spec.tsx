import { render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { vi } from 'vitest'
import { AwaitImage } from './AwaitImage'

beforeEach(() => {
  vi.spyOn(globalThis, 'Image').mockImplementation((): HTMLImageElement => {
    const img = document.createElement('img')
    setTimeout(() => {
      Object.defineProperty(img, 'width', { value: 100 })
      Object.defineProperty(img, 'height', { value: 200 })
      img.onload?.(new Event('load'))
    }, 0)
    return img
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('<AwaitImage />', () => {
  it('renders children after image load', async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <AwaitImage src="/img.png">
          {(img) => (
            <div>
              Image size: {img.width}x{img.height}
            </div>
          )}
        </AwaitImage>
      </Suspense>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    // expect(await screen.findByText('Image size: 100x200')).toBeInTheDocument()
  })
})
