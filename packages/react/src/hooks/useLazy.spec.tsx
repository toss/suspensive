/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { act, render, screen, renderHook } from '@testing-library/react'
import { type ComponentType, Suspense, useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { type LazyComponent, LazyProvider } from '../contexts/LazyContext'
import { lazy } from '../lazy'
import { useLazy } from './useLazy'
import { sleep } from '../test-utils'

type PathData = {
  cache: Promise<{ default: ComponentType<any> }> | null
  attempt: number
  failureCount: number
}

type ImportOptions = {
  failureCount: number
  failureDelay: number
  successDelay: number
}

class ImportCache {
  private pathData = new Map<string, PathData>()

  createImport(options: ImportOptions) {
    return vi
      .fn<(path: string) => Promise<{ default: ComponentType<any> }>>()
      .mockImplementation((path: string) => this.import(path, options))
  }

  private async import(path: string, options: ImportOptions): Promise<{ default: ComponentType<any> }> {
    const data = this.pathData.get(path) || { cache: null, attempt: 0, failureCount: 0 }

    if (data.cache) {
      return data.cache
    }

    data.attempt++
    this.pathData.set(path, data)

    try {
      const promise = this.fetchBundle(path, data.attempt - 1, options)
      const result = await promise

      data.cache = Promise.resolve(result)
      this.pathData.set(path, data)

      return result
    } catch (error) {
      throw error
    }
  }

  private async fetchBundle(
    path: string,
    attempt: number,
    { failureCount, failureDelay, successDelay }: ImportOptions
  ): Promise<{ default: ComponentType<any> }> {
    if (attempt < failureCount) {
      await sleep(failureDelay)

      throw new Error(`Failed to load ${path} (attempt ${attempt + 1})`)
    }

    await sleep(successDelay)

    return { default: () => <div>Component from {path}</div> }
  }

  clear() {
    this.pathData.clear()
  }

  getAttempt(path: string): number {
    return this.pathData.get(path)?.attempt || 0
  }

  isCached(path: string): boolean {
    return this.pathData.get(path)?.cache !== null
  }

  getFailureCount(path: string): number {
    return this.pathData.get(path)?.failureCount || 0
  }
}

const importCache = new ImportCache()

describe('useLazy', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    importCache.clear()
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  it('should throw error when used outside LazyProvider', () => {
    const mockImport = importCache.createImport({ failureCount: 0, failureDelay: 100, successDelay: 100 })
    const Component = lazy(() => mockImport('/test-component'))

    expect(() => {
      renderHook(() => useLazy(Component))
    }).toThrow('useLazyContext must be used within a LazyProvider')
  })

  it('should track loading states of lazy components', async () => {
    const mockImport = importCache.createImport({ failureCount: 0, failureDelay: 100, successDelay: 100 })
    const Component = lazy(() => mockImport('/test-component'))

    const { result } = renderHook(() => useLazy(Component), {
      wrapper: LazyProvider,
    })

    // Initial state
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isLoaded).toBe(false)

    // Start loading
    act(() => {
      result.current.load()
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.isLoaded).toBe(false)

    // Complete loading
    await act(() => vi.advanceTimersByTimeAsync(100))

    expect(result.current.isLoading).toBe(false)
    expect(result.current.isLoaded).toBe(true)
  })

  it('should handle loading errors correctly', async () => {
    const mockImport = importCache.createImport({ failureCount: 1, failureDelay: 100, successDelay: 100 })
    const Component = lazy(() => mockImport('/test-component'))

    const { result } = renderHook(() => useLazy(Component), {
      wrapper: LazyProvider,
    })

    // Initial state
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isLoaded).toBe(false)

    // Start loading
    let loadPromise: Promise<void>
    act(() => {
      loadPromise = result.current.load()
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.isLoaded).toBe(false)

    // Loading should fail
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
      await expect(loadPromise).rejects.toThrow()
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.isLoaded).toBe(false)
  })

  it('should not start loading again if already loading', async () => {
    const mockImport = importCache.createImport({ failureCount: 0, failureDelay: 100, successDelay: 100 })
    const Component = lazy(() => mockImport('/test-component'))

    const { result } = renderHook(() => useLazy(Component), {
      wrapper: LazyProvider,
    })

    // Start loading
    act(() => {
      result.current.load()
    })

    expect(result.current.isLoading).toBe(true)
    expect(mockImport).toHaveBeenCalledTimes(1)

    // Try to load again while loading
    act(() => {
      result.current.load()
    })

    expect(result.current.isLoading).toBe(true)
    expect(mockImport).toHaveBeenCalledTimes(1) // Should not call again
  })

  it('should not start loading again if already loaded', async () => {
    const mockImport = importCache.createImport({ failureCount: 0, failureDelay: 100, successDelay: 100 })
    const Component = lazy(() => mockImport('/test-component'))

    const { result } = renderHook(() => useLazy(Component), {
      wrapper: LazyProvider,
    })

    // Load component
    act(() => {
      result.current.load()
    })

    await act(() => vi.advanceTimersByTimeAsync(100))

    expect(result.current.isLoading).toBe(false)
    expect(result.current.isLoaded).toBe(true)
    expect(mockImport).toHaveBeenCalledTimes(1)

    // Try to load again after loaded
    act(() => {
      result.current.load()
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.isLoaded).toBe(true)
    expect(mockImport).toHaveBeenCalledTimes(1) // Should not call again
  })

  it('should work with multiple lazy components independently', async () => {
    const mockImport1 = importCache.createImport({ failureCount: 0, failureDelay: 100, successDelay: 100 })
    const mockImport2 = importCache.createImport({ failureCount: 0, failureDelay: 200, successDelay: 200 })

    const Component1 = lazy(() => mockImport1('/component1'))
    const Component2 = lazy(() => mockImport2('/component2'))

    const { result: result1 } = renderHook(() => useLazy(Component1), {
      wrapper: LazyProvider,
    })

    const { result: result2 } = renderHook(() => useLazy(Component2), {
      wrapper: LazyProvider,
    })

    // Start loading component1
    act(() => {
      result1.current.load()
    })

    expect(result1.current.isLoading).toBe(true)
    expect(result1.current.isLoaded).toBe(false)
    expect(result2.current.isLoading).toBe(false)
    expect(result2.current.isLoaded).toBe(false)

    // Start loading component2
    act(() => {
      result2.current.load()
    })

    expect(result1.current.isLoading).toBe(true)
    expect(result1.current.isLoaded).toBe(false)
    expect(result2.current.isLoading).toBe(true)
    expect(result2.current.isLoaded).toBe(false)

    // Component1 finishes loading first
    await act(() => vi.advanceTimersByTimeAsync(100))

    expect(result1.current.isLoading).toBe(false)
    expect(result1.current.isLoaded).toBe(true)
    expect(result2.current.isLoading).toBe(true)
    expect(result2.current.isLoaded).toBe(false)

    // Component2 finishes loading
    await act(() => vi.advanceTimersByTimeAsync(100))

    expect(result1.current.isLoading).toBe(false)
    expect(result1.current.isLoaded).toBe(true)
    expect(result2.current.isLoading).toBe(false)
    expect(result2.current.isLoaded).toBe(true)
  })

  it('should work in a realistic navigation scenario', async () => {
    const mockImport = importCache.createImport({ failureCount: 0, failureDelay: 100, successDelay: 100 })
    const Page1 = lazy(() => mockImport('/page1'))

    const NavItemToPage1 = () => {
      const lazyPage1 = useLazy(Page1)
      return (
        <div>
          <button onMouseEnter={() => lazyPage1.load()} data-testid="nav-button">
            to Page1 {lazyPage1.isLoading ? 'loading...' : lazyPage1.isLoaded ? 'loaded' : 'not loaded'}
          </button>
        </div>
      )
    }

    const Example = () => {
      const [showPage, setShowPage] = useState(false)
      return (
        <LazyProvider>
          <NavItemToPage1 />
          <button onClick={() => setShowPage(true)} data-testid="show-page">
            Show Page
          </button>
          {showPage && (
            <Suspense fallback={<div>Suspense loading...</div>}>
              <Page1 />
            </Suspense>
          )}
        </LazyProvider>
      )
    }

    render(<Example />)

    // Initial state
    expect(screen.getByText('to Page1 not loaded')).toBeInTheDocument()

    // Mouse enter to preload
    const navButton = screen.getByTestId('nav-button')
    navButton.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))

    expect(screen.getByText('to Page1 loading...')).toBeInTheDocument()

    // Loading completes
    await act(() => vi.advanceTimersByTimeAsync(100))

    expect(screen.getByText('to Page1 loaded')).toBeInTheDocument()

    // Show the page - it should load instantly since it's preloaded
    screen.getByTestId('show-page').click()

    // Should not show suspense fallback since component is already loaded
    await act(() => vi.advanceTimersByTimeAsync(0))
    expect(screen.getByText('Component from /page1')).toBeInTheDocument()
    expect(screen.queryByText('Suspense loading...')).not.toBeInTheDocument()
  })
})
