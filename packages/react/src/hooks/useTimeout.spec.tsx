import { act, render, renderHook, screen } from '@testing-library/react'
import ms from 'ms'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useTimeout } from '.'

vi.useFakeTimers()

const TestComponent = () => {
  const [number, setNumber] = useState(0)

  useTimeout(() => {
    setNumber(number + 1)
  }, ms('0.1s'))

  return <div>{number}</div>
}

describe('useTimeout', () => {
  it('should run given function once after given timeout', () => {
    const fn = vi.fn()
    const rendered = renderHook(() => useTimeout(fn, ms('0.1s')))
    expect(fn).toHaveBeenCalledTimes(0)
    act(() => vi.advanceTimersByTime(ms('0.1s')))
    expect(fn).toHaveBeenCalledTimes(1)
    act(() => vi.advanceTimersByTime(ms('0.1s')))
    expect(fn).toHaveBeenCalledTimes(1)
    rendered.rerender()
    expect(fn).toHaveBeenCalledTimes(1)
    act(() => vi.advanceTimersByTime(ms('0.1s')))
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should not re-call callback received as argument even if component using this hook is rerendered', () => {
    const { rerender } = render(<TestComponent />)

    expect(screen.getByText('0')).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(ms('0.1s')))
    expect(screen.getByText('1')).toBeInTheDocument()

    rerender(<TestComponent />)

    act(() => vi.advanceTimersByTime(ms('0.1s')))
    expect(screen.getByText('1')).toBeInTheDocument()
  })
})
