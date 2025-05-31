import { render, screen } from '@testing-library/react'
import { atom } from 'jotai'
import { AtomValue } from './AtomValue'

describe('<AtomValue />', () => {
  it('should render with a primitive atom', () => {
    const countAtom = atom(10)

    render(<AtomValue atom={countAtom}>{(count) => <div>count: {count}</div>}</AtomValue>)

    expect(screen.getByText('count: 10')).toBeInTheDocument()
  })

  it('should call children with correct value', () => {
    const testAtom = atom('abc')
    const children = vi.fn(() => <div>Test</div>)

    render(<AtomValue atom={testAtom}>{children}</AtomValue>)

    expect(children).toHaveBeenCalledWith('abc')
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
