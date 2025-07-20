/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { act, render, screen } from '@testing-library/react'
import { type ComponentType, Suspense, useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'
import { lazy, reloadOnError } from './lazy'
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

  describe('reloadOnError option', () => {
    const mockReload = vi.fn((id: ReturnType<typeof setTimeout>) => {
      clearTimeout(id)
    })

    it('should reload importing the component up to 1 time if it fails to load', async () => {
      const customLazy = lazy.create(reloadOnError({ storage, reload: mockReload }))
      const mockImport = importCache.createImport({ failureCount: 1, failureDelay: 0, successDelay: 100 })

      const Component1 = customLazy(() => mockImport('/test-component'))
      render(
        <ErrorBoundary fallback={<div>error</div>}>
          <Component1 />
        </ErrorBoundary>
      )
      expect(mockImport).toHaveBeenCalledTimes(1)
      await act(() => vi.advanceTimersByTimeAsync(100))
      expect(mockReload).toHaveBeenCalledTimes(1)

      const Component2 = customLazy(() => mockImport('/test-component'))
      render(
        <ErrorBoundary fallback={<div>error</div>}>
          <Component2 />
        </ErrorBoundary>
      )
      expect(mockImport).toHaveBeenCalledTimes(2)
      await act(() => vi.advanceTimersByTimeAsync(100))
      expect(mockReload).toHaveBeenCalledTimes(1)
    })

    it('should reload the page when component fails to load', async () => {
      const customLazy = lazy.create(reloadOnError({ storage, reload: mockReload }))
      const mockImport = importCache.createImport({ failureCount: 1, failureDelay: 0, successDelay: 0 })
      const Component1 = customLazy(() => mockImport('/test-component'))
      render(
        <ErrorBoundary fallback={<div>error</div>}>
          <Component1 />
        </ErrorBoundary>
      )
      expect(mockImport).toHaveBeenCalledTimes(1)
      await act(() => vi.advanceTimersByTimeAsync(100))
      expect(mockReload).toHaveBeenCalledTimes(1)

      const Component2 = customLazy(() => mockImport('/test-component'))
      render(
        <ErrorBoundary fallback={<div>error</div>}>
          <Component2 />
        </ErrorBoundary>
      )
      expect(mockImport).toHaveBeenCalledTimes(2)
      await act(() => vi.advanceTimersByTimeAsync(100))
      expect(mockReload).toHaveBeenCalledTimes(1)
    })

    it('should not reload if reload is false', () => {
      const mockImport = importCache.createImport({ failureCount: 1, failureDelay: 100, successDelay: 100 })
      const customLazy = lazy.create(reloadOnError({ storage, reload: mockReload, retry: false }))

      const Component = customLazy(() => mockImport('/test-component'))
      const Component2 = customLazy(() => mockImport('/test-component'))

      expect(() => render(<Component />)).not.toThrow()
      expect(() => render(<Component2 />)).not.toThrow()

      expect(mockReload).toHaveBeenCalledTimes(0)
      expect(storage.length).toBe(0)
    })

    it('should reload infinitely if reload is true', async () => {
      // Default reload count is 3, so 10 times reload might enough to test infinite reload
      const mockImport = importCache.createImport({ failureCount: 10, failureDelay: 0, successDelay: 100 })
      const customLazy = lazy.create(reloadOnError({ storage, retryDelay: 100, reload: mockReload, retry: true }))

      for (let i = 0; i < 10; i++) {
        const Component = customLazy(() => mockImport('/infinite-test'))

        render(
          <ErrorBoundary fallback={<div>error</div>}>
            <Component />
          </ErrorBoundary>
        )

        expect(mockImport).toHaveBeenCalledTimes(i + 1)
        await act(() => vi.advanceTimersByTimeAsync(100))
        expect(mockReload).toHaveBeenCalledTimes(i + 1)
      }

      // Verify no storage is used for infinite retries
      expect(storage.length).toBe(0)
    })

    it('should reload the component with a delay', async () => {
      const customLazy = lazy.create(reloadOnError({ storage, retryDelay: 100, reload: mockReload }))
      const mockImport = importCache.createImport({ failureCount: 1, failureDelay: 100, successDelay: 0 })
      const Component = customLazy(() => mockImport('/test-component'))

      render(
        <ErrorBoundary fallback={<div>error</div>}>
          <Component />
        </ErrorBoundary>
      )

      expect(mockReload).toHaveBeenCalledTimes(0)
      await act(() => vi.advanceTimersByTimeAsync(200))
      expect(mockReload).toHaveBeenCalledTimes(1)
    })

    describe('reloadOnError with additional callbacks', () => {
      it('should not destroy reloadOnError when adding onSuccess/onError to component options', async () => {
        const customLazy = lazy.create(reloadOnError({ storage, reload: mockReload }))
        const mockImport = importCache.createImport({ failureCount: 1, failureDelay: 0, successDelay: 0 })
        const componentOnSuccess = vi.fn()
        const componentOnError = vi.fn()

        const Component = customLazy(() => mockImport('/test-component'), {
          onSuccess: componentOnSuccess,
          onError: componentOnError,
        })

        render(
          <ErrorBoundary fallback={<div>error</div>}>
            <Component />
          </ErrorBoundary>
        )

        expect(mockImport).toHaveBeenCalledTimes(1)
        await act(() => vi.advanceTimersByTimeAsync(100))
        expect(mockReload).toHaveBeenCalledTimes(1)

        // Component's onError should also be called
        expect(componentOnError).toHaveBeenCalledTimes(1)
        expect(componentOnError).toHaveBeenCalledWith({ error: expect.any(Error), load: expect.any(Function) })
      })

      it('should not destroy reloadOnError when using it as component options with onSuccess/onError', async () => {
        const mockImport = importCache.createImport({ failureCount: 1, failureDelay: 0, successDelay: 100 })
        const componentOnSuccess = vi.fn()
        const componentOnError = vi.fn()

        const Component = lazy(
          () => mockImport('/test-component'),
          reloadOnError({
            storage,
            reload: mockReload,
            onSuccess: componentOnSuccess,
            onError: componentOnError,
          })
        )

        render(
          <ErrorBoundary fallback={<div>error</div>}>
            <Component />
          </ErrorBoundary>
        )

        expect(mockImport).toHaveBeenCalledTimes(1)
        await act(() => vi.advanceTimersByTimeAsync(100))

        // reloadOnError should work
        expect(mockReload).toHaveBeenCalledTimes(1)
        // Component's onError should also be called
        expect(componentOnError).toHaveBeenCalledTimes(1)
        expect(componentOnError).toHaveBeenCalledWith({ error: expect.any(Error), load: expect.any(Function) })
      })

      it('should not destroy reloadOnError when creating lazy with reloadOnError containing onSuccess/onError', async () => {
        const factoryOnSuccess = vi.fn()
        const factoryOnError = vi.fn()
        const componentOnSuccess = vi.fn()
        const componentOnError = vi.fn()
        const customLazy = lazy.create(
          reloadOnError({
            storage,
            reload: mockReload,
            onSuccess: factoryOnSuccess,
            onError: factoryOnError,
          })
        )
        const mockImport = importCache.createImport({ failureCount: 1, failureDelay: 0, successDelay: 100 })

        const Component = customLazy(() => mockImport('/test-component'), {
          onSuccess: componentOnSuccess,
          onError: componentOnError,
        })

        render(
          <ErrorBoundary fallback={<div>error</div>}>
            <Component />
          </ErrorBoundary>
        )

        expect(mockImport).toHaveBeenCalledTimes(1)
        await act(() => vi.advanceTimersByTimeAsync(100))

        // reloadOnError should work
        expect(mockReload).toHaveBeenCalledTimes(1)
        // Factory's onError should also be called
        expect(factoryOnError).toHaveBeenCalledTimes(1)
        expect(factoryOnError).toHaveBeenCalledWith({ error: expect.any(Error), load: expect.any(Function) })
        expect(componentOnError).toHaveBeenCalledTimes(1)
        expect(componentOnError).toHaveBeenCalledWith({ error: expect.any(Error), load: expect.any(Function) })
        expect(factoryOnSuccess).toHaveBeenCalledTimes(0)
        expect(componentOnSuccess).toHaveBeenCalledTimes(0)

        const Component2 = customLazy(() => mockImport('/test-component'), {
          onSuccess: componentOnSuccess,
          onError: componentOnError,
        })

        render(
          <ErrorBoundary fallback={<div>error</div>}>
            <Component2 />
          </ErrorBoundary>
        )

        expect(mockImport).toHaveBeenCalledTimes(2)
        await act(() => vi.advanceTimersByTimeAsync(100))

        expect(factoryOnError).toHaveBeenCalledTimes(1)
        expect(componentOnError).toHaveBeenCalledTimes(1)
        expect(factoryOnSuccess).toHaveBeenCalledWith({ load: expect.any(Function) })
        expect(componentOnSuccess).toHaveBeenCalledWith({ load: expect.any(Function) })

        expect(screen.getByText('Component from /test-component')).toBeInTheDocument()
      })
    })
  })
})
