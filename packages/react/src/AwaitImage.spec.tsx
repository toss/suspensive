import { render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { AwaitImage } from './AwaitImage'

beforeEach(() => {
  vi.stubGlobal(
    'Image',
    class {
      width = 0
      height = 0
      onload: (() => void) | null = null
      onerror: (() => void) | null = null

      constructor() {
        setTimeout(() => {
          this.width = 100
          this.height = 200
          this.onload?.()
        }, 0)
      }
    }
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
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
    expect(await screen.findByText('Image size: 100x200')).toBeInTheDocument()
  })
})
