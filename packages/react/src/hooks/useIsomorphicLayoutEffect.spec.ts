import { useEffect, useLayoutEffect } from 'react'
import { afterEach, expect, vi } from 'vitest'

describe('useIsomorphicLayoutEffect', () => {
  const originWindow = global.window

  afterEach(() => {
    vi.resetModules()
  })

  it('should be useEffect in server environment', async () => {
    Object.defineProperty(global, 'window', {
      value: undefined,
    })

    const { useIsomorphicLayoutEffect } = await import('./useIsomorphicLayoutEffect')
    expect(useIsomorphicLayoutEffect).toEqual(useEffect)
  })

  it('should be useLayoutEffect in client environment', async () => {
    Object.defineProperty(global, 'window', {
      value: originWindow,
    })

    const { useIsomorphicLayoutEffect } = await import('./useIsomorphicLayoutEffect')
    expect(useIsomorphicLayoutEffect).toEqual(useLayoutEffect)
  })
})
