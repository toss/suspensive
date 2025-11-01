import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Component from './index'

describe('test-utils default component', () => {
  it('should render the default component', () => {
    render(<Component />)

    expect(screen.getByText('Component')).toBeInTheDocument()
  })
})
