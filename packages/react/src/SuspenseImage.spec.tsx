import { render, screen } from '@testing-library/react'
import React, { Suspense } from 'react'
import { vi } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'
import { SuspenseImage } from './SuspenseImage'

let imageConstructorCalls = 0

beforeEach(() => {
  imageConstructorCalls = 0

  vi.stubGlobal(
    'Image',
    class {
      width = 0
      height = 0
      src = ''
      onload: (() => void) | null = null
      onerror: ((e: Error) => void) | null = null

      constructor() {
        imageConstructorCalls++
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

describe('<SuspenseImage />', () => {
  it('renders children after image load', async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <SuspenseImage src="/img.png">
          {(img) => (
            <div>
              Image size: {img.width}x{img.height}
            </div>
          )}
        </SuspenseImage>
      </Suspense>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(await screen.findByText('Image size: 100x200')).toBeInTheDocument()
  })

  it('throws error when image fails to load', async () => {
    vi.stubGlobal(
      'Image',
      class {
        onload: (() => void) | null = null
        onerror: (() => void) | null = null
        src = ''

        constructor() {
          setTimeout(() => {
            this.onerror?.()
          }, 0)
        }
      }
    )

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary fallback={<div>Error occurred</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <SuspenseImage src="/broken.png">{() => <div>Should not render</div>}</SuspenseImage>
        </Suspense>
      </ErrorBoundary>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(await screen.findByText('Error occurred')).toBeInTheDocument()

    errorSpy.mockRestore()
  })

  it('caches image and reuses on subsequent renders', async () => {
    const childrenFn = vi.fn((img: HTMLImageElement) => (
      <div>
        Image size: {img.width}x{img.height}
      </div>
    ))

    const { rerender } = render(
      <Suspense fallback={<div>Loading...</div>}>
        <SuspenseImage src="/cached.png">{childrenFn}</SuspenseImage>
      </Suspense>
    )

    await screen.findByText('Image size: 100x200')
    expect(imageConstructorCalls).toBe(1)

    rerender(
      <Suspense fallback={<div>Loading...</div>}>
        <SuspenseImage src="/cached.png">{childrenFn}</SuspenseImage>
      </Suspense>
    )

    await screen.findByText('Image size: 100x200')
    expect(imageConstructorCalls).toBe(1)
  })

  it('loads different images independently', async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <SuspenseImage src="/img1.png">{(img) => <div data-testid="img1">Image 1: {img.width}</div>}</SuspenseImage>
        <SuspenseImage src="/img2.png">{(img) => <div data-testid="img2">Image 2: {img.width}</div>}</SuspenseImage>
      </Suspense>
    )

    expect(await screen.findByTestId('img1')).toBeInTheDocument()
    expect(await screen.findByTestId('img2')).toBeInTheDocument()
    expect(imageConstructorCalls).toBe(2)
  })

  it('provides correct image dimensions to children', async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <SuspenseImage src="/img.png">
          {(img) => (
            <div>
              <span data-testid="width">{img.width}</span>
              <span data-testid="height">{img.height}</span>
            </div>
          )}
        </SuspenseImage>
      </Suspense>
    )

    expect(await screen.findByTestId('width')).toHaveTextContent('100')
    expect(await screen.findByTestId('height')).toHaveTextContent('200')
  })
})
