import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useForesight } from './useForesight'

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

function TestComponent({
  callback,
  disabled,
  autoInitialize = true,
}: {
  callback: () => void
  disabled?: boolean
  autoInitialize?: boolean
}) {
  const { ref, isRegistered, registerResult } = useForesight({
    callback,
    name: 'test-element',
    disabled,
    autoInitialize,
  })

  return (
    <div>
      <button ref={ref} data-testid="target-button">
        Test Button
      </button>
      <span data-testid="registered-status">{isRegistered.toString()}</span>
      <span data-testid="result-status">{registerResult ? 'has-result' : 'no-result'}</span>
    </div>
  )
}

describe('useForesight', () => {
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

  it('should register element with ForesightManager', () => {
    const callback = vi.fn()
    render(<TestComponent callback={callback} />)

    expect(mockRegister).toHaveBeenCalledWith({
      element: expect.any(Element),
      callback,
      hitSlop: undefined,
      name: 'test-element',
      meta: undefined,
      reactivateAfter: undefined,
    })
  })

  it('should not register when disabled', () => {
    const callback = vi.fn()
    render(<TestComponent callback={callback} disabled />)

    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('should unregister element on unmount', () => {
    const callback = vi.fn()
    const { unmount } = render(<TestComponent callback={callback} />)

    unmount()

    expect(mockUnregister).toHaveBeenCalledWith(expect.any(Element), 'apiCall')
  })

  it('should show registration status', () => {
    const callback = vi.fn()
    render(<TestComponent callback={callback} />)

    expect(screen.getByTestId('registered-status')).toHaveTextContent('true')
    expect(screen.getByTestId('result-status')).toHaveTextContent('has-result')
  })

  it('should handle unregistered state when disabled', () => {
    mockRegister.mockReturnValue({
      isRegistered: false,
      isTouchDevice: true,
      isLimitedConnection: false,
      unregister: vi.fn(),
    })

    const callback = vi.fn()
    render(<TestComponent callback={callback} disabled />)

    expect(screen.getByTestId('registered-status')).toHaveTextContent('false')
    expect(screen.getByTestId('result-status')).toHaveTextContent('no-result')
  })

  it('should not auto-initialize when autoInitialize is false', () => {
    const callback = vi.fn()

    // Mock isInitiated to return false to test initialization
    vi.mocked(mockForesightManager, { partial: true }).isInitiated = false

    render(<TestComponent callback={callback} autoInitialize={false} />)

    expect(mockInitialize).not.toHaveBeenCalled()
  })
})
