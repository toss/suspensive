import { render, screen } from '@testing-library/react'
import { TestText } from './TestText'

describe('<TestText />', () => {
  it('should render text "Test" with custom text', () => {
    render(<TestText />)

    expect(screen.queryByText('Test')).toBeInTheDocument()
    expect(screen.queryByText('Text')).not.toBeInTheDocument()
  })
})
