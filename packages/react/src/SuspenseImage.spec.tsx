import { render, screen } from '@testing-library/react'
import React, { Suspense } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'
import { SuspenseImage, clearImageCache, useSuspenseImage } from './SuspenseImage'
import { noop } from './utils/noop'

let imageConstructorCalls = 0

beforeEach(() => {
  imageConstructorCalls = 0
  clearImageCache()

  vi.stubGlobal(
    'Image',
    class {
      width = 0
      height = 0
      naturalWidth = 0
      naturalHeight = 0
      complete = false
      src = ''
      onload: (() => void) | null = null
      onerror: ((e: Error) => void) | null = null

      constructor() {
        imageConstructorCalls++
        setTimeout(() => {
          this.width = 100
          this.height = 200
          this.naturalWidth = 100
          this.naturalHeight = 200
          this.complete = true
          this.onload?.()
        }, 0)
      }
    }
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('SuspenseImage', () => {
  it('renders children after image load', async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <SuspenseImage src="/img.png">
          {(img) => (
            <div>
              Image size: {img.naturalWidth}x{img.naturalHeight}
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
        complete = false
        naturalWidth = 0
        private _src = ''

        get src() {
          return this._src
        }

        set src(value: string) {
          this._src = value
          setTimeout(() => {
            console.log('=== onerror 호출 ===')
            this.onerror?.()
          }, 0)
        }
      }
    )

    vi.spyOn(console, 'error').mockImplementation(noop)

    render(
      <ErrorBoundary fallback={<div>Error occurred</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <SuspenseImage src="/broken.png">{() => <div>Should not render</div>}</SuspenseImage>
        </Suspense>
      </ErrorBoundary>
    )

    expect(await screen.findByText('Error occurred')).toBeInTheDocument()
  })

  it('caches and reuses image on subsequent renders', async () => {
    const { rerender } = render(
      <Suspense fallback={<div>Loading...</div>}>
        <SuspenseImage src="/cached.png">{(img) => <div>Loaded: {img.naturalWidth}</div>}</SuspenseImage>
      </Suspense>
    )

    await screen.findByText('Loaded: 100')
    expect(imageConstructorCalls).toBe(1)

    rerender(
      <Suspense fallback={<div>Loading...</div>}>
        <SuspenseImage src="/cached.png">{(img) => <div>Loaded: {img.naturalWidth}</div>}</SuspenseImage>
      </Suspense>
    )

    expect(imageConstructorCalls).toBe(1)
  })

  it('loads different images independently', async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <SuspenseImage src="/img1.png">{(img) => <div data-testid="img1">{img.naturalWidth}</div>}</SuspenseImage>
        <SuspenseImage src="/img2.png">{(img) => <div data-testid="img2">{img.naturalWidth}</div>}</SuspenseImage>
      </Suspense>
    )

    expect(await screen.findByTestId('img1')).toBeInTheDocument()
    expect(await screen.findByTestId('img2')).toBeInTheDocument()
    expect(imageConstructorCalls).toBe(2)
  })
})

describe('useSuspenseImage', () => {
  function Component({ src }: { src: string }) {
    const img = useSuspenseImage(src)
    return (
      <div>
        Size: {img.naturalWidth}x{img.naturalHeight}
      </div>
    )
  }

  it('returns HTMLImageElement after load', async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <Component src="/img.png" />
      </Suspense>
    )

    expect(await screen.findByText('Size: 100x200')).toBeInTheDocument()
  })

  it('provides correct src property', async () => {
    function SrcComponent() {
      const img = useSuspenseImage('/test.png')
      return <div data-testid="src">{img.src}</div>
    }

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <SrcComponent />
      </Suspense>
    )

    expect(await screen.findByTestId('src')).toHaveTextContent('/test.png')
  })
})
