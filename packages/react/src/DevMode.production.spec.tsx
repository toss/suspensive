import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DevMode } from './DevMode'
import { Suspensive, SuspensiveProvider } from './Suspensive'

describe('<DevMode/> (process.env.NODE_ENV: production)', () => {
  it('should show nothing if without SuspensiveProvider', () => {
    render(<DevMode />)
    expect(screen.queryByRole('Suspensive.DevMode-off')).not.toBeInTheDocument()
    expect(screen.queryByRole('Suspensive.DevMode-on')).not.toBeInTheDocument()
  })

  it('should show nothing on production mode in SuspensiveProvider', () => {
    const suspensive = new Suspensive()
    const renderResult = render(
      <SuspensiveProvider value={suspensive}>
        <DevMode />
      </SuspensiveProvider>
    )

    expect(renderResult.queryByRole('Suspensive.DevMode-off')).not.toBeInTheDocument()
  })
})
