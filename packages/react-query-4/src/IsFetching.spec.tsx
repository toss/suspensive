import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { IsFetching } from './IsFetching'

const { useIsFetchingMock } = vi.hoisted(() => ({
  useIsFetchingMock: vi.fn(() => 0),
}))

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    ...actual,
    useIsFetching: useIsFetchingMock,
  }
})

describe('<IsFetching/>', () => {
  afterEach(() => {
    useIsFetchingMock.mockReset()
    useIsFetchingMock.mockReturnValue(0)
  })

  it('should forward query filters to useIsFetching', () => {
    useIsFetchingMock.mockReturnValue(7)

    render(
      <IsFetching queryKey={['todos']}>{(isFetching) => <div data-testid="is-fetching">{isFetching}</div>}</IsFetching>
    )

    expect(useIsFetchingMock).toHaveBeenCalledTimes(1)
    expect(useIsFetchingMock).toHaveBeenCalledWith({ queryKey: ['todos'] })
    expect(screen.getByTestId('is-fetching')).toHaveTextContent('7')
  })
})
