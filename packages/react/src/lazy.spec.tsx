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

describe('lazy', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    storage.clear()
    importCache.clear()
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  it('should not throw an error if the component is loaded successfully', () => {
    const Component = lazy(() => import('./test-utils'))
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
      render(
        <ErrorBoundary fallback={<div>error</div>}>
          <Suspense fallback={<div>loading...</div>}>
            <Component1 />
          </Suspense>
        </ErrorBoundary>
      )
      expect(screen.getByText('loading...')).toBeInTheDocument()
      await act(() => vi.advanceTimersByTimeAsync(350))
      expect(screen.getByText('error')).toBeInTheDocument()

      const Component2 = lazy(() => mockImport('/test-component'))
      render(
        <ErrorBoundary fallback={<div>error</div>}>
          <Suspense fallback={<div>loading...</div>}>
            <Component2 />
          </Suspense>
        </ErrorBoundary>
      )
      await act(() => vi.advanceTimersByTimeAsync(250))
      expect(screen.getByText('Component from /test-component')).toBeInTheDocument()
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
      expect(screen.getByText('error')).toBeInTheDocument()
    })
  })

  describe('lazy.create', () => {
    it('should use custom default options', async () => {
      const mockImport = importCache.createImport({ failureCount: 0, failureDelay: 100, successDelay: 100 })
      const onSuccess = vi.fn()
      const customLazy = lazy.create({ onSuccess })

      const Component = customLazy(() => mockImport('/test-component'))
      render(<Component />)
      await act(() => vi.advanceTimersByTimeAsync(200))

      expect(onSuccess).toHaveBeenCalledTimes(1)
    })

    it('should merge default options with provided options', async () => {
      const mockImport = importCache.createImport({ failureCount: 0, failureDelay: 100, successDelay: 100 })
      const defaultOnSuccess = vi.fn()
      const customOnSuccess = vi.fn()
      const customLazy = lazy.create({ onSuccess: defaultOnSuccess })

      const Component = customLazy(() => mockImport('/test-component'), { onSuccess: customOnSuccess })
      render(<Component />)
      await act(() => vi.advanceTimersByTimeAsync(200))

      expect(defaultOnSuccess).not.toHaveBeenCalled()
      expect(customOnSuccess).toHaveBeenCalledTimes(1)
    })

    it('should handle onError callback without fallback', async () => {
      const mockImport = importCache.createImport({ failureCount: 10, failureDelay: 100, successDelay: 100 })
      const onError = vi.fn().mockReturnValue(undefined)
      const customLazy = lazy.create({ onError })

      const Component = customLazy(() => mockImport('/failing-component'))
      render(
        <ErrorBoundary fallback={<div>error</div>}>
          <Component />
        </ErrorBoundary>
      )
      await act(() => vi.advanceTimersByTimeAsync(200))

      expect(onError).toHaveBeenCalledTimes(1)
      expect(screen.getByText('error')).toBeInTheDocument()
    })
  })

  describe('onSuccess and onError callbacks', () => {
    it('should call onSuccess when component loads successfully', async () => {
      const mockImport = importCache.createImport({ failureCount: 0, failureDelay: 100, successDelay: 100 })
      const onSuccess = vi.fn()

      const Component = lazy(() => mockImport('/test-component'), { onSuccess })
      render(<Component />)
      await act(() => vi.advanceTimersByTimeAsync(200))

      expect(onSuccess).toHaveBeenCalledTimes(1)
    })

    it('should call onError when component fails to load', async () => {
      const mockImport = importCache.createImport({ failureCount: 10, failureDelay: 100, successDelay: 100 })
      const onError = vi.fn()

      const Component = lazy(() => mockImport('/failing-component'), { onError })
      render(
        <ErrorBoundary fallback={<div>error</div>}>
          <Component />
        </ErrorBoundary>
      )
      await act(() => vi.advanceTimersByTimeAsync(200))

      expect(onError).toHaveBeenCalledTimes(1)
      expect(onError).toHaveBeenCalledWith({ error: expect.any(Error), load: expect.any(Function) })
    })
  })
})
