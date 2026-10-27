import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { IsMutating } from './IsMutating'

const { useIsMutatingMock } = vi.hoisted(() => ({
  useIsMutatingMock: vi.fn(() => 0),
}))

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    ...actual,
    useIsMutating: useIsMutatingMock,
  }
})

describe('<IsMutating/>', () => {
  afterEach(() => {
    useIsMutatingMock.mockReset()
    useIsMutatingMock.mockReturnValue(0)
  })

  it('should forward mutation filters to useIsMutating', () => {
    useIsMutatingMock.mockReturnValue(3)

    render(
      <IsMutating mutationKey={['todos']}>
        {(isMutating) => <div data-testid="is-mutating">{isMutating}</div>}
      </IsMutating>
    )

    expect(useIsMutatingMock).toHaveBeenCalledTimes(1)
    expect(useIsMutatingMock).toHaveBeenCalledWith({ mutationKey: ['todos'] })
    expect(screen.getByTestId('is-mutating')).toHaveTextContent('3')
  })
})
