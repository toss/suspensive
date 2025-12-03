import { render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { Suspend } from './Suspend'
import { FALLBACK, TEXT } from './test-utils'

describe('<Suspend/>', () => {
  it('should keep Suspense in fallback state indefinitely', () => {
    render(
      <Suspense fallback={FALLBACK}>
        <Suspend />
        {TEXT}
      </Suspense>
    )

    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
  })

  it('should have displayName', () => {
    expect(Suspend.displayName).toBe('Suspend')
  })
})
