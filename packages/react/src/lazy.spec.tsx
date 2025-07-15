import { act, render, screen } from '@testing-library/react'
import { type ComponentType, Suspense, useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'
import { lazy } from './lazy'
import { sleep } from './test-utils'

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
    return this.pathData.get(path)?.cache !== undefined
  }
  getFailureCount(path: string): number {
    return this.pathData.get(path)?.failureCount || 0
  }
}

const importCache = new ImportCache()

class MockStorage {
  private items = new Map<string, string>()
  setItem(key: string, value: string) {
    this.items.set(key, value)
  }
  getItem(key: string) {
    return this.items.get(key) ?? null
  }
  removeItem(key: string) {
    this.items.delete(key)
  }
  clear() {
    this.items.clear()
  }
  get length() {
    return this.items.size
  }
  key() {
    return this.items.keys().next().value ?? null
  }
}

const storage = new MockStorage()
const mockReload = vi.fn<() => void>()

describe('lazy', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      reload: mockReload,
    } as unknown as Location)
    vi.spyOn(window, 'sessionStorage', 'get').mockReturnValue(storage)
  })

  afterEach(() => {
    storage.clear()
    importCache.clear()
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  it('should reload importing the component up to 1 time if it fails to load', async () => {
    const mockImport = importCache.createImport({ failureCount: 1, failureDelay: 100, successDelay: 100 })

    const Component1 = lazy(() => mockImport('/test-component'))
    render(<Component1 />)
    expect(mockImport).toHaveBeenCalledTimes(1)
    await act(() => vi.advanceTimersByTimeAsync(100))
    expect(mockReload).toHaveBeenCalledTimes(1)

    const Component2 = lazy(() => mockImport('/test-component'))
    render(<Component2 />)
    expect(mockImport).toHaveBeenCalledTimes(2)
    await act(() => vi.advanceTimersByTimeAsync(100))
    expect(mockReload).toHaveBeenCalledTimes(1)
  })

  it('should reload the page when component fails to load', async () => {
    const mockImport = importCache.createImport({ failureCount: 1, failureDelay: 100, successDelay: 100 })
    const Component1 = lazy(() => mockImport('/test-component'))
    render(<Component1 />)
    expect(mockImport).toHaveBeenCalledTimes(1)
    await act(() => vi.advanceTimersByTimeAsync(100))
    expect(mockReload).toHaveBeenCalledTimes(1)

    const Component2 = lazy(() => mockImport('/test-component'))
    render(<Component2 />)
    expect(mockImport).toHaveBeenCalledTimes(2)
    await act(() => vi.advanceTimersByTimeAsync(100))
    expect(mockReload).toHaveBeenCalledTimes(1)
  })

  it('should not reload if reload is false', () => {
    const mockImport = importCache.createImport({ failureCount: 1, failureDelay: 100, successDelay: 100 })
    const customLazy = lazy.create({ reload: false })

    const Component = customLazy(() => mockImport('/test-component'))
    const Component2 = customLazy(() => mockImport('/test-component'))

    expect(() => render(<Component />)).not.toThrow()
    expect(() => render(<Component2 />)).not.toThrow()

    expect(mockReload).toHaveBeenCalledTimes(0)
    expect(storage.length).toBe(0)
  })

  it('should reload infinitely if reload is true', async () => {
    // Default reload count is 3, so 10 times reload might enough to test infinite reload
    const mockImport = importCache.createImport({ failureCount: 10, failureDelay: 100, successDelay: 100 })
    const customLazy = lazy.create({ reload: true })

    for (let i = 0; i < 10; i++) {
      const Component = customLazy(() => mockImport('/infinite-test'))
      render(<Component />)
      expect(mockImport).toHaveBeenCalledTimes(i + 1)
      await act(() => vi.advanceTimersByTimeAsync(100))
      expect(mockReload).toHaveBeenCalledTimes(i + 1)
    }

    // Verify no storage is used for infinite retries
    expect(storage.length).toBe(0)
  })

  it('should not throw an error if the component is loaded successfully', () => {
    const Component = lazy(() => import('./test-utils/Component'))
    expect(() => render(<Component />)).not.toThrow()
  })

  it('should preload the component', async () => {
    const mockImport = importCache.createImport({ failureCount: 0, failureDelay: 100, successDelay: 100 })
    const Component = lazy(() => mockImport('/test-component'))

    const Example = () => {
      const [isShow, setIsShow] = useState(false)

      return (
        <div>
          <button
            onClick={() => {
              Component.load()
            }}
          >
            load
          </button>
          <button onClick={() => setIsShow(true)}>show</button>
          {isShow ? (
            <Suspense fallback={<div>loading...</div>}>
              <Component />
            </Suspense>
          ) : (
            <>not loaded</>
          )}
        </div>
      )
    }

    render(<Example />)
    expect(screen.getByText('not loaded')).toBeInTheDocument()
    expect(screen.queryByText('Component from /test-component')).not.toBeInTheDocument()

    screen.getByRole('button', { name: 'load' }).click()

    await act(() => vi.advanceTimersByTimeAsync(1000))
    screen.getByRole('button', { name: 'show' }).click()
    await act(() => vi.advanceTimersByTimeAsync(1000))
    expect(screen.getByText('Component from /test-component')).toBeInTheDocument()
  })

  it('should clear sessionStorage when component loads successfully', () => {
    const mockImport = importCache.createImport({ failureCount: 0, failureDelay: 100, successDelay: 100 })
    const Component = lazy(() => mockImport('/test-component'))

    render(<Component />)

    expect(storage.length).toBe(0)
    expect(storage.getItem((() => mockImport('/test-component')).toString())).toBeNull()
  })

  describe('with unified test helper', () => {
    it('should cache successful imports with timing difference', async () => {
      const mockImport = importCache.createImport({ failureCount: 0, failureDelay: 100, successDelay: 100 })
      const Component1 = lazy(() => mockImport('/cached-component'))
      const Component2 = lazy(() => mockImport('/cached-component'))

      render(<Component1 />)
      await act(() => vi.advanceTimersByTimeAsync(200))

      expect(importCache.getAttempt('/cached-component')).toBe(1)
      expect(importCache.isCached('/cached-component')).toBe(true)

      render(<Component2 />)
      await act(() => vi.advanceTimersByTimeAsync(50))

      expect(importCache.getAttempt('/cached-component')).toBe(1)
    })

    it('should respect custom fail and success delays in createImport', async () => {
      const mockImport = importCache.createImport({
        failureCount: 1,
        failureDelay: 300,
        successDelay: 200,
      })

      const Component1 = lazy(() => mockImport('/test-component'))
      render(<Component1 />)
      await act(() => vi.advanceTimersByTimeAsync(350))
      expect(mockReload).toHaveBeenCalledTimes(1)

      const Component2 = lazy(() => mockImport('/test-component'))
      render(<Component2 />)
      await act(() => vi.advanceTimersByTimeAsync(250))
      expect(mockReload).toHaveBeenCalledTimes(1)

      const Component3 = lazy(() => mockImport('/test-component'))
      render(<Component3 />)
      await act(() => vi.advanceTimersByTimeAsync(50))
    })

    it('should work with createImport for bundle cache simulation', async () => {
      const bundleImport = importCache.createImport({ failureCount: 1, failureDelay: 150, successDelay: 150 })

      const Component = lazy(() => bundleImport('/bundle-component'))
      render(<Component />)
      await act(() => vi.advanceTimersByTimeAsync(200))
      expect(mockReload).toHaveBeenCalledTimes(1)

      const Component2 = lazy(() => bundleImport('/bundle-component'))
      render(<Component2 />)
      await act(() => vi.advanceTimersByTimeAsync(200))
      expect(mockReload).toHaveBeenCalledTimes(1)

      const Component3 = lazy(() => bundleImport('/bundle-component'))
      render(<Component3 />)
      await act(() => vi.advanceTimersByTimeAsync(50))
    })
    it('should handle permanently failing imports', async () => {
      const mockImport = importCache.createImport({ failureCount: 10, failureDelay: 100, successDelay: 100 })
      const Component = lazy(() => mockImport('/permanent-fail'))
      render(
        <ErrorBoundary fallback={<div>error</div>}>
          <Component />
        </ErrorBoundary>
      )
      await act(() => vi.advanceTimersByTimeAsync(200))
      expect(screen.queryByText('error')).not.toBeInTheDocument()
      expect(mockReload).toHaveBeenCalledTimes(1)
      const Component2 = lazy(() => mockImport('/permanent-fail'))
      render(
        <ErrorBoundary fallback={<div>error</div>}>
          <Component2 />
        </ErrorBoundary>
      )
      await act(() => vi.advanceTimersByTimeAsync(200))
      expect(screen.getByText('error')).toBeInTheDocument()
    })
  })

  describe('lazy.create', () => {
    it('should use custom reload count', async () => {
      const mockImport = importCache.createImport({ failureCount: 1, failureDelay: 100, successDelay: 100 })
      const customLazy = lazy.create({ reload: 2 })

      const Component1 = customLazy(() => mockImport('/test-component'))
      render(<Component1 />)
      expect(mockImport).toHaveBeenCalledTimes(1)
      await act(() => vi.advanceTimersByTimeAsync(100))
      expect(mockReload).toHaveBeenCalledTimes(1)

      const Component2 = customLazy(() => mockImport('/test-component'))
      render(<Component2 />)
      expect(mockImport).toHaveBeenCalledTimes(2)
      await act(() => vi.advanceTimersByTimeAsync(100))
      expect(mockReload).toHaveBeenCalledTimes(1)
      expect(screen.getByText('Component from /test-component')).toBeInTheDocument()
    })

    it('should not reload when reload is 0', () => {
      const mockImport = importCache.createImport({ failureCount: 1, failureDelay: 100, successDelay: 100 })
      const customLazy = lazy.create({ reload: 0 })
      const Component1 = customLazy(() => mockImport('/test-component'))
      render(<Component1 />)
      expect(mockImport).toHaveBeenCalledTimes(1)
      expect(mockReload).not.toHaveBeenCalled()
      expect(screen.queryByText('Component from /test-component')).not.toBeInTheDocument()
    })

    it('should handle NaN reload count from sessionStorage', async () => {
      const mockImport = importCache.createImport({ failureCount: 1, failureDelay: 100, successDelay: 100 })
      const customLazy = lazy.create({ reload: 2 })
      const Component1 = customLazy(() => mockImport('/test-component'))

      storage.setItem((() => mockImport('/test-component')).toString(), 'invalid')
      expect(storage.getItem((() => mockImport('/test-component')).toString())).toBe('invalid')

      render(<Component1 />)
      await act(() => vi.advanceTimersByTimeAsync(100))

      expect(mockImport).toHaveBeenCalledTimes(1)
      expect(mockReload).toHaveBeenCalledTimes(1)

      expect(storage.getItem((() => mockImport('/test-component')).toString())).toBe('1')

      const Component2 = customLazy(() => mockImport('/test-component'))
      render(<Component2 />)
      await act(() => vi.advanceTimersByTimeAsync(100))
      expect(mockImport).toHaveBeenCalledTimes(2)
      expect(mockReload).toHaveBeenCalledTimes(1)
      expect(screen.getByText('Component from /test-component')).toBeInTheDocument()
    })

    it('should merge default options with provided options', async () => {
      const mockImport = importCache.createImport({ failureCount: 1, failureDelay: 100, successDelay: 100 })
      const customLazy = lazy.create({ reload: 5 })
      const Component1 = customLazy(() => mockImport('/test-component'), { reload: 2 })

      render(<Component1 />)
      await act(() => vi.advanceTimersByTimeAsync(100))
      expect(mockImport).toHaveBeenCalledTimes(1)
      expect(mockReload).toHaveBeenCalledTimes(1)

      const Component2 = customLazy(() => mockImport('/test-component'), { reload: 2 })
      render(<Component2 />)
      await act(() => vi.advanceTimersByTimeAsync(100))
      expect(mockImport).toHaveBeenCalledTimes(2)
      expect(mockReload).toHaveBeenCalledTimes(1)
    })
  })

  describe('development mode validation', () => {
    const originalEnv = process.env.NODE_ENV
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    afterEach(() => {
      process.env.NODE_ENV = originalEnv
      consoleSpy.mockClear()
    })

    it('should log error for invalid reload value in development', () => {
      process.env.NODE_ENV = 'development'
      const Component = lazy.create({ reload: -1 })(() => Promise.resolve({ default: () => <div>Test</div> }))
      render(<Component />)

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('reload option must be a positive integer'))
    })

    it('should log error for non-integer reload value in development', () => {
      process.env.NODE_ENV = 'development'
      const Component = lazy.create({ reload: 1.5 })(() => Promise.resolve({ default: () => <div>Test</div> }))
      render(<Component />)

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('reload option must be a positive integer'))
    })

    it('should not log error in production mode', () => {
      process.env.NODE_ENV = 'production'

      const Component = lazy.create({ reload: -1 })(() => Promise.resolve({ default: () => <div>Test</div> }))
      render(<Component />)

      expect(consoleSpy).not.toHaveBeenCalled()
    })

    it('should not log error for valid reload values in development', () => {
      process.env.NODE_ENV = 'development'

      const Component1 = lazy.create({ reload: 1 })(() => Promise.resolve({ default: () => <div>Test</div> }))
      const Component2 = lazy.create({ reload: 5 })(() => Promise.resolve({ default: () => <div>Test</div> }))
      render(<Component1 />)
      render(<Component2 />)

      expect(consoleSpy).not.toHaveBeenCalled()
    })
  })
})
