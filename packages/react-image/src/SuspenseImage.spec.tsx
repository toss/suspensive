import { render, screen } from '@testing-library/react'
import { SuspenseImage } from './SuspenseImage'

describe('<SuspenseImage/>', () => {
  it('renders an image with the loaded src', async () => {
    const src = 'https://placehold.co/200x100'
    render(<SuspenseImage src={src} alt="Test Image" />)
    expect(await screen.findByAltText('Test Image')).toHaveAttribute('src', src)
    expect(await screen.findByRole('img')).toHaveAttribute('src', src)
  })

  it('throws an error if src is not a string', () => {
    console.error = vi.fn()
    expect(() => {
      // @ts-expect-error: non-string src value for testing purposes
      render(<SuspenseImage src={123} alt="Test Image" />)
    }).toThrow('<SuspenseImage/> of @suspensive/react-image requires string src')
  })
})
