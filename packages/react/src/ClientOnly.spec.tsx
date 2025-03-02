import { render, screen, waitFor } from '@testing-library/react'
import { createElement } from 'react'
import { type Mock } from 'vitest'
import { ClientOnly } from './ClientOnly'
import { useIsClient } from './hooks/useIsClient'
import { TEXT } from './test-utils'

vi.mock('./hooks/useIsClient', () => ({
  useIsClient: vi.fn(),
}))

afterEach(() => {
  vi.clearAllMocks()
})

describe('<ClientOnly/>', () => {
  it('renders children when isClient is true', () => {
    ;(useIsClient as Mock).mockReturnValue(true)

    render(
      <ClientOnly fallback={<div>Loading...</div>}>
        <div>Client Content</div>
      </ClientOnly>
    )

    expect(screen.getByText('Client Content')).toBeInTheDocument()
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })

  it('renders fallback when isClient is false', () => {
    ;(useIsClient as Mock).mockReturnValue(false)

    render(
      <ClientOnly fallback={<div>Loading...</div>}>
        <div>Client Content</div>
      </ClientOnly>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByText('Client Content')).not.toBeInTheDocument()
  })
})

describe('ClientOnly.with', () => {
  it('should wrap component. we can check by mocked useIsClient', async () => {
    ;(useIsClient as Mock).mockReturnValue(false)

    render(createElement(ClientOnly.with({ fallback: 'not client' }, () => <>{TEXT}</>)))
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
  })

  it('should set displayName based on Component.displayName', () => {
    const Component = () => <></>
    Component.displayName = 'Custom'
    expect(ClientOnly.with({}, Component).displayName).toBe('ClientOnly.with(Custom)')
    expect(ClientOnly.with({}, () => <></>).displayName).toBe('ClientOnly.with(Component)')
  })
})
