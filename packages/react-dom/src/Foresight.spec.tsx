import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Foresight } from './Foresight'

// Mock js.foresight
const mockRegister = vi.fn()
const mockUnregister = vi.fn()
const mockInitialize = vi.fn()

const mockForesightManager = {
  register: mockRegister,
  unregister: mockUnregister,
}

vi.mock('js.foresight', () => ({
  ForesightManager: {
    initialize: mockInitialize,
    get isInitiated() {
      return true
    },
    get instance() {
      return mockForesightManager
    },
  },
}))

describe('<Foresight/>', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRegister.mockReturnValue({
      isRegistered: true,
      isTouchDevice: false,
      isLimitedConnection: false,
      unregister: vi.fn(),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render children with foresight result', () => {
    const callback = vi.fn()

    render(
      <Foresight callback={callback} name="test-element">
        {({ ref, isRegistered, registerResult }) => (
          <div>
            <button ref={ref} data-testid="target-button">
              Test Button
            </button>
            <span data-testid="registered-status">{isRegistered.toString()}</span>
            <span data-testid="result-status">{registerResult ? 'has-result' : 'no-result'}</span>
          </div>
        )}
      </Foresight>
    )

    expect(screen.getByTestId('target-button')).toBeInTheDocument()
    expect(screen.getByTestId('registered-status')).toHaveTextContent('true')
    expect(screen.getByTestId('result-status')).toHaveTextContent('has-result')
  })

  it('should pass options to useForesight hook', () => {
    const callback = vi.fn()

    render(
      <Foresight
        callback={callback}
        name="test-element"
        hitSlop={10}
        meta={{ testMeta: 'value' }}
        reactivateAfter={5000}
      >
        {({ ref }) => <button ref={ref}>Test</button>}
      </Foresight>
    )

    expect(mockRegister).toHaveBeenCalledWith({
      element: expect.any(Element),
      callback,
      hitSlop: 10,
      name: 'test-element',
      meta: { testMeta: 'value' },
      reactivateAfter: 5000,
    })
  })

  it('should handle disabled state', () => {
    const callback = vi.fn()

    render(
      <Foresight callback={callback} name="test-element" disabled>
        {({ ref, isRegistered }) => (
          <div>
            <button ref={ref}>Test</button>
            <span data-testid="status">{isRegistered.toString()}</span>
          </div>
        )}
      </Foresight>
    )

    expect(mockRegister).not.toHaveBeenCalled()
    expect(screen.getByTestId('status')).toHaveTextContent('false')
  })
})
