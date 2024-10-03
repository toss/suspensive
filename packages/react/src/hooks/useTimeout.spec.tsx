import { render, renderHook, screen } from '@testing-library/react'
import ms from 'ms'
import { useState } from 'react'
import { sleep } from '../test-utils'
import { useTimeout } from './useTimeout'

describe('useTimeout', () => {
  it('should run given function once after given timeout', async () => {
    const spy = vi.fn()
    const result = renderHook(() => useTimeout(spy, ms('0.1s')))
    expect(spy).toHaveBeenCalledTimes(0)
    await sleep(ms('0.1s'))
    expect(spy).toHaveBeenCalledTimes(1)
    result.rerender(() => useTimeout(spy, ms('0.1s')))
    await sleep(ms('0.1s'))
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('should call the modified function when the given function is changed', async () => {
    const timeoutMockFn1 = vi.fn()
    const timeoutMockFn2 = vi.fn()

    const { rerender } = renderHook(({ fn }) => useTimeout(fn, ms('0.1s')), {
      initialProps: { fn: timeoutMockFn1 },
    })

    rerender({ fn: timeoutMockFn2 })

    expect(timeoutMockFn1).toHaveBeenCalledTimes(0)
    expect(timeoutMockFn2).toHaveBeenCalledTimes(0)

    await sleep(ms('0.1s'))

    expect(timeoutMockFn1).toHaveBeenCalledTimes(0)
    expect(timeoutMockFn2).toHaveBeenCalledTimes(1)
  })

  it('should not re-call callback received as argument even if component using this hook is rerendered', async () => {
    const TestComponent = () => {
      const [number, setNumber] = useState(0)

      useTimeout(() => {
        setNumber(number + 1)
      }, ms('0.1s'))

      return <div>{number}</div>
    }

    const result = render(<TestComponent />)
    expect(screen.getByText('0')).toBeInTheDocument()
    await sleep(ms('0.1s'))
    expect(screen.getByText('1')).toBeInTheDocument()
    result.rerender(<TestComponent />)
    expect(screen.getByText('1')).toBeInTheDocument()
  })
})
