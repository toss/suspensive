import { render, screen } from '@testing-library/react-native'
import { TestText } from './TestText'

describe('<TestText />', () => {
  it('should render text "Test" with custom text', () => {
    render(<TestText />)

    expect(screen.queryByRole('text', { name: 'Test' })).toBeOnTheScreen()
    expect(screen.queryByRole('text', { name: 'Text' })).not.toBeOnTheScreen()
  })
})
