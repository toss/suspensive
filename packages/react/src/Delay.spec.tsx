import { TEXT } from '@suspensive/test-utils'
import { render, screen, waitFor } from '@testing-library/react'
import ms from 'ms'
import { describe, expect, it } from 'vitest'
import { Delay } from './Delay'
import { DelayMsPropShouldBeGreaterThanOrEqualTo0 } from './utils/assert'

describe('<Delay/>', () => {
  it('should render the children after the delay', async () => {
    render(<Delay ms={ms('0.1s')}>{TEXT}</Delay>)

    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
  })
  it('should render the children directly if no ms prop', () => {
    render(<Delay>{TEXT}</Delay>)
    expect(screen.queryByText(TEXT)).toBeInTheDocument()
  })
  it('should accept 0 for ms prop', async () => {
    render(<Delay ms={0}>{TEXT}</Delay>)
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument(), { timeout: 1000 })
  })
  it('should throw error if negative number is passed as ms prop', () => {
    expect(() => render(<Delay ms={-1}>{TEXT}</Delay>)).toThrow(DelayMsPropShouldBeGreaterThanOrEqualTo0)
  })
})
