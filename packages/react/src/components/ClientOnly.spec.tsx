import { render, screen } from '@testing-library/react'
import { useIsClient } from '../hooks/useIsClient'
import { ClientOnly } from './ClientOnly'

vi.mock('./useIsClient', () => ({
  useIsClient: vi.fn(),
}))

afterEach(() => {
  vi.clearAllMocks()
})

describe('<ClientOnly/>', () => {
  it('renders children when isClient is true', () => {
    useIsClient.mockReturnValue(true)

    render(
      <ClientOnly fallback={<div>Loading...</div>}>
        <div>Client Content</div>
      </ClientOnly>
    )

    expect(screen.getByText('Client Content')).toBeInTheDocument()
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })

  it('renders fallback when isClient is false', () => {
    useIsClient.mockReturnValue(false)

    render(
      <ClientOnly fallback={<div>Loading...</div>}>
        <div>Client Content</div>
      </ClientOnly>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByText('Client Content')).not.toBeInTheDocument()
  })
})
