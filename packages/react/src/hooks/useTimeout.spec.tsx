import { MS_100 } from '@suspensive/test-utils'
import { act, render, renderHook, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useTimeout } from '.'

vi.useFakeTimers()

const TestComponent = () => {
  const [number, setNumber] = useState(0)

  useTimeout(() => {
    setNumber(number + 1)
  }, MS_100)

  return <div>{number}</div>
}

describe('useTimeout', () => {
  it('should run given function once after given timeout', () => {
    const fn = vi.fn()
    const rendered = renderHook(() => useTimeout(fn, MS_100))
    expect(fn).toHaveBeenCalledTimes(0)
    act(() => vi.advanceTimersByTime(MS_100))
    expect(fn).toHaveBeenCalledTimes(1)
    act(() => vi.advanceTimersByTime(MS_100))
    expect(fn).toHaveBeenCalledTimes(1)
    rendered.rerender()
    expect(fn).toHaveBeenCalledTimes(1)
    act(() => vi.advanceTimersByTime(MS_100))
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should not be re-called even if the component is re-rendered', () => {
    const { rerender } = render(<TestComponent />)

    expect(screen.getByText('0')).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(MS_100))
    expect(screen.getByText('1')).toBeInTheDocument()

    rerender(<TestComponent />)

    act(() => vi.advanceTimersByTime(MS_100))
    expect(screen.getByText('1')).toBeInTheDocument()
  })
})
