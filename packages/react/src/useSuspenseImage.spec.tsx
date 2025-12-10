import { render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { vi } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'
import { useSuspenseImage } from './useSuspenseImage'

let imageConstructorCalls = 0

beforeEach(() => {
  imageConstructorCalls = 0

  vi.stubGlobal(
    'Image',
    class {
      naturalWidth = 0
      naturalHeight = 0
      src = ''
      onload: (() => void) | null = null
      onerror: ((e: Error) => void) | null = null

      constructor() {
        imageConstructorCalls++
        setTimeout(() => {
          this.naturalWidth = 100
          this.naturalHeight = 200
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

function TestComponent({ src }: { src: string }) {
  const img = useSuspenseImage(src)
  return (
    <div>
      Image size: {img.naturalWidth}x{img.naturalHeight}
    </div>
  )
}

describe('useSuspenseImage', () => {
  it('returns HTMLImageElement after image load', async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <TestComponent src="/img.png" />
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
          <TestComponent src="/broken.png" />
        </Suspense>
      </ErrorBoundary>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(await screen.findByText('Error occurred')).toBeInTheDocument()

    errorSpy.mockRestore()
  })

  it('caches image and reuses on subsequent renders', async () => {
    const { rerender } = render(
      <Suspense fallback={<div>Loading...</div>}>
        <TestComponent src="/cached.png" />
      </Suspense>
    )

    await screen.findByText('Image size: 100x200')
    expect(imageConstructorCalls).toBe(1)

    rerender(
      <Suspense fallback={<div>Loading...</div>}>
        <TestComponent src="/cached.png" />
      </Suspense>
    )

    await screen.findByText('Image size: 100x200')
    expect(imageConstructorCalls).toBe(1)
  })

  it('loads different images independently', async () => {
    function MultiImageComponent() {
      const img1 = useSuspenseImage('/img1.png')
      const img2 = useSuspenseImage('/img2.png')
      return (
        <>
          <div data-testid="img1">Image 1: {img1.naturalWidth}</div>
          <div data-testid="img2">Image 2: {img2.naturalWidth}</div>
        </>
      )
    }

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <MultiImageComponent />
      </Suspense>
    )

    expect(await screen.findByTestId('img1')).toBeInTheDocument()
    expect(await screen.findByTestId('img2')).toBeInTheDocument()
    expect(imageConstructorCalls).toBe(2)
  })

  it('provides correct image dimensions', async () => {
    function DimensionComponent() {
      const img = useSuspenseImage('/img.png')
      return (
        <div>
          <span data-testid="width">{img.naturalWidth}</span>
          <span data-testid="height">{img.naturalHeight}</span>
        </div>
      )
    }

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <DimensionComponent />
      </Suspense>
    )

    expect(await screen.findByTestId('width')).toHaveTextContent('100')
    expect(await screen.findByTestId('height')).toHaveTextContent('200')
  })

  it('provides image src property', async () => {
    function SrcComponent() {
      const img = useSuspenseImage('/test-image.png')
      return <div data-testid="src">{img.src}</div>
    }

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <SrcComponent />
      </Suspense>
    )

    expect(await screen.findByTestId('src')).toHaveTextContent('/test-image.png')
  })
})
