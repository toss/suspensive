import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DevMode } from './DevMode'
import { ErrorBoundary } from './ErrorBoundary'
import { Suspense } from './Suspense'
import { Suspensive, SuspensiveProvider } from './Suspensive'

describe('<DevMode/>', () => {
  it('should show nothing if without SuspensiveProvider', () => {
    const renderResult = render(<DevMode />)
    expect(renderResult.queryByText('Suspensive.DevMode: off')).not.toBeInTheDocument()
    expect(renderResult.queryByText('Suspensive.DevMode: on')).not.toBeInTheDocument()
  })

  it('should show `Suspensive.DevMode: off` in SuspensiveProvider', () => {
    const suspensive = new Suspensive()
    const renderResult = render(
      <SuspensiveProvider value={suspensive}>
        <DevMode />
      </SuspensiveProvider>
    )

    expect(renderResult.getByText('Suspensive.DevMode: off')).toBeInTheDocument()
  })

  it('should show nothing on production mode in SuspensiveProvider', () => {
    process.env.NODE_ENV = 'production'
    const suspensive = new Suspensive()
    const renderResult = render(
      <SuspensiveProvider value={suspensive}>
        <DevMode />
      </SuspensiveProvider>
    )

    expect(renderResult.queryByText('Suspensive.DevMode: off')).not.toBeInTheDocument()
    process.env.NODE_ENV = undefined
  })

  it('should scale up itself if hover', () => {
    const suspensive = new Suspensive()
    const renderResult = render(
      <SuspensiveProvider value={suspensive}>
        <DevMode />
      </SuspensiveProvider>
    )

    const devMode = renderResult.getByText('Suspensive.DevMode: off')
    expect(devMode).toBeInTheDocument()
    expect(devMode?.style.transform).toBe('scale(1)')
    fireEvent.mouseEnter(devMode)
    expect(devMode?.style.transform).toBe('scale(1.1)')
    fireEvent.mouseLeave(devMode)
    expect(devMode?.style.transform).toBe('scale(1)')
  })

  it('should show `Suspensive.DevMode: on` if clicked', () => {
    const suspensive = new Suspensive()
    const renderResult = render(
      <SuspensiveProvider value={suspensive}>
        <DevMode />
      </SuspensiveProvider>
    )

    const devMode = renderResult.getByText('Suspensive.DevMode: off')
    expect(devMode).toBeInTheDocument()
    fireEvent.click(devMode)
    expect(renderResult.getByText('Suspensive.DevMode: on')).toBeInTheDocument()
  })

  it('should make Suspense.CSROnly show fallback if DevMode is clicked once', () => {
    const suspensive = new Suspensive()
    const renderResult = render(
      <SuspensiveProvider value={suspensive}>
        <Suspense.CSROnly
          fallback="loading..."
          devMode={{
            showFallback: true,
          }}
        >
          children
        </Suspense.CSROnly>
        <DevMode />
      </SuspensiveProvider>
    )
    expect(renderResult.getByText('Suspensive.DevMode: off')).toBeInTheDocument()
    expect(renderResult.getByText('children')).toBeInTheDocument()
    fireEvent.click(renderResult.getByText('Suspensive.DevMode: off'))
    expect(renderResult.getByText('Suspensive.DevMode: on')).toBeInTheDocument()
    expect(renderResult.getByText('loading...')).toBeInTheDocument()
  })
  it('should make Suspense.CSROnly as no devMode if devMode prop is just object', () => {
    const suspensive = new Suspensive()
    const renderResult = render(
      <SuspensiveProvider value={suspensive}>
        <Suspense.CSROnly fallback="loading..." devMode={{}}>
          children
        </Suspense.CSROnly>
        <DevMode />
      </SuspensiveProvider>
    )
    expect(renderResult.getByText('Suspensive.DevMode: off')).toBeInTheDocument()
    expect(renderResult.getByText('children')).toBeInTheDocument()
    fireEvent.click(renderResult.getByText('Suspensive.DevMode: off'))
    expect(renderResult.getByText('Suspensive.DevMode: on')).toBeInTheDocument()
    expect(renderResult.getByText('children')).toBeInTheDocument()
  })
  it('should make Suspense show fallback if DevMode is clicked once', () => {
    const suspensive = new Suspensive()
    const renderResult = render(
      <SuspensiveProvider value={suspensive}>
        <Suspense
          fallback="loading..."
          devMode={{
            showFallback: true,
          }}
        >
          children
        </Suspense>
        <DevMode />
      </SuspensiveProvider>
    )
    expect(renderResult.getByText('Suspensive.DevMode: off')).toBeInTheDocument()
    expect(renderResult.getByText('children')).toBeInTheDocument()
    fireEvent.click(renderResult.getByText('Suspensive.DevMode: off'))
    expect(renderResult.getByText('Suspensive.DevMode: on')).toBeInTheDocument()
    expect(renderResult.getByText('loading...')).toBeInTheDocument()
  })
  it('should make Suspense as no devMode if devMode prop is just object', () => {
    const suspensive = new Suspensive()
    const renderResult = render(
      <SuspensiveProvider value={suspensive}>
        <Suspense fallback="loading..." devMode={{}}>
          children
        </Suspense>
        <DevMode />
      </SuspensiveProvider>
    )
    expect(renderResult.getByText('Suspensive.DevMode: off')).toBeInTheDocument()
    expect(renderResult.getByText('children')).toBeInTheDocument()
    fireEvent.click(renderResult.getByText('Suspensive.DevMode: off'))
    expect(renderResult.getByText('Suspensive.DevMode: on')).toBeInTheDocument()
    expect(renderResult.getByText('children')).toBeInTheDocument()
  })

  it('should make ErrorBoundary show fallback if DevMode is clicked once', () => {
    const suspensive = new Suspensive()
    const renderResult = render(
      <SuspensiveProvider value={suspensive}>
        <ErrorBoundary
          fallback="errorBoundary fallback"
          devMode={{
            showFallback: true,
          }}
        >
          children
        </ErrorBoundary>
        <DevMode />
      </SuspensiveProvider>
    )
    expect(renderResult.getByText('Suspensive.DevMode: off')).toBeInTheDocument()
    expect(renderResult.getByText('children')).toBeInTheDocument()
    fireEvent.click(renderResult.getByText('Suspensive.DevMode: off'))
    expect(renderResult.getByText('Suspensive.DevMode: on')).toBeInTheDocument()
    expect(renderResult.getByText('errorBoundary fallback')).toBeInTheDocument()
  })
  it('should make ErrorBoundary as no devMode if devMode prop is just object', () => {
    const suspensive = new Suspensive()
    const renderResult = render(
      <SuspensiveProvider value={suspensive}>
        <ErrorBoundary fallback="errorBoundary fallback" devMode={{}}>
          children
        </ErrorBoundary>
        <DevMode />
      </SuspensiveProvider>
    )
    expect(renderResult.getByText('Suspensive.DevMode: off')).toBeInTheDocument()
    expect(renderResult.getByText('children')).toBeInTheDocument()
    fireEvent.click(renderResult.getByText('Suspensive.DevMode: off'))
    expect(renderResult.getByText('Suspensive.DevMode: on')).toBeInTheDocument()
    expect(renderResult.getByText('children')).toBeInTheDocument()
  })
})
