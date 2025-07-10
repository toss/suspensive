import { act, render } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { safeLazy } from './safeLazy'

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

beforeAll(() => {
  // HACK: We don't need every object in the `window.location`
  vi.spyOn(window, 'location', 'get').mockReturnValue({ reload: vi.fn() } as unknown as Location)
  vi.spyOn(window, 'sessionStorage', 'get').mockReturnValue(storage)
})

afterEach(() => {
  storage.clear()
  vi.clearAllMocks()
})

describe('default `safeLazy` function', () => {
  it('should not retry importing the component if it fails to load', async () => {
    const importFunction = vi.fn().mockRejectedValue(new Error('Failed to load component'))
    const Component = safeLazy(importFunction)
    const { container } = await act(() => render(<Component />))

    expect(container.childNodes).toHaveLength(0)
    expect(importFunction).toHaveBeenCalledTimes(1)
  })

  it('should reload the page if the component fails to load', async () => {
    const importFunction = vi.fn().mockRejectedValue(new Error('Failed to load component'))
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const reloadFunction = window.location.reload
    const Component = safeLazy(importFunction)
    const Component2 = safeLazy(importFunction)
    await expect(async () => {
      await act(() =>
        render(
          <>
            <Component />
            <Component2 />
          </>
        )
      )
    }).rejects.toThrow('Failed to load component')

    expect(importFunction).toHaveBeenCalledTimes(2)
    expect(reloadFunction).toHaveBeenCalledTimes(1)
  })

  it('should reload the page only once if the component fails to load', async () => {
    const importFunction = vi.fn().mockRejectedValue(new Error('Failed to load component'))
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const reloadFunction = window.location.reload
    const Component = safeLazy(importFunction)
    await act(() => render(<Component />))

    const Component2 = safeLazy(importFunction)
    await expect(async () => {
      await act(() => render(<Component2 />))
    }).rejects.toThrow('Failed to load component')

    expect(importFunction).toHaveBeenCalledTimes(2)
    expect(reloadFunction).toHaveBeenCalledTimes(1)
  })
})
