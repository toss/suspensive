import { fireEvent, render, screen } from '@testing-library/react'
import { atom } from 'jotai'
import { AtomValue } from './AtomValue'
import { SetAtom } from './SetAtom'

describe('<SetAtom />', () => {
  it('should render and set value to a primitive writable atom', () => {
    const countAtom = atom(0)

    render(
      <>
        <AtomValue atom={countAtom}>{(count) => <div>count: {count}</div>}</AtomValue>
        <SetAtom atom={countAtom}>
          {(setCount) => (
            <button type="button" onClick={() => setCount(10)}>
              Set 10
            </button>
          )}
        </SetAtom>
      </>
    )

    expect(screen.getByText('count: 0')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Set 10'))
    expect(screen.getByText('count: 10')).toBeInTheDocument()
  })

  it('should call custom write logic with arguments', () => {
    const log = vi.fn()

    const baseAtom = atom(0)
    const customWriteAtom = atom(
      (get) => get(baseAtom),
      (_get, set, value: number) => {
        log(value)
        set(baseAtom, value * 2)
      }
    )

    render(
      <>
        <AtomValue atom={baseAtom}>{(value) => <div>base: {value}</div>}</AtomValue>
        <SetAtom atom={customWriteAtom}>
          {(setValue) => (
            <button type="button" onClick={() => setValue(5)}>
              Custom Set
            </button>
          )}
        </SetAtom>
      </>
    )

    fireEvent.click(screen.getByText('Custom Set'))
    expect(log).toHaveBeenCalledWith(5)
    expect(screen.getByText('base: 10')).toBeInTheDocument()
  })

  it('should call children with correct set function', () => {
    const toggleAtom = atom(false)
    const children = vi.fn(() => <div>Test</div>)

    render(<SetAtom atom={toggleAtom}>{children}</SetAtom>)

    expect(children).toHaveBeenCalled()
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
