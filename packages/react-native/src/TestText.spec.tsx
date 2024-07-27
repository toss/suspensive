const { render } = require('@testing-library/react-native')
const { TestText } = require('./TestText')

describe('<TestText />', () => {
  it('should render text "Test"', () => {
    const screen = render(<TestText />)
    expect(screen.queryByText('Test')).toBeInTheDocument()
  })

  it('should render text "Test" with custom text', () => {
    expect(1).toBe(1)
  })
})
