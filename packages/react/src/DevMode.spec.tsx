import { fireEvent, render, screen } from '@testing-library/react'
import { DevMode } from './DevMode'
import { ErrorBoundary } from './ErrorBoundary'
import { Suspense } from './Suspense'
import { Suspensive, SuspensiveProvider } from './Suspensive'

describe('<DevMode/> (process.env.NODE_ENV: development)', () => {
  it('should show nothing if without SuspensiveProvider', () => {
    render(<DevMode />)
    expect(screen.queryByRole('Suspensive.DevMode-off')).not.toBeInTheDocument()
    expect(screen.queryByRole('Suspensive.DevMode-on')).not.toBeInTheDocument()
  })

  it('should show DevMode with role `Suspensive.DevMode: off` in SuspensiveProvider', () => {
    const suspensive = new Suspensive()
    render(
      <SuspensiveProvider value={suspensive}>
        <DevMode />
      </SuspensiveProvider>
    )
    expect(screen.getByRole('Suspensive.DevMode-off')).toBeInTheDocument()
  })

  it('should scale up itself if hover', () => {
    const suspensive = new Suspensive()
    render(
      <SuspensiveProvider value={suspensive}>
        <DevMode />
      </SuspensiveProvider>
    )

    const devMode = screen.getByRole('Suspensive.DevMode-off')
    expect(devMode).toBeInTheDocument()
    expect(devMode.style.transform).toBe('scale(1)')
    fireEvent.mouseEnter(devMode)
    expect(devMode.style.transform).toBe('scale(1.1)')
    fireEvent.mouseLeave(devMode)
    expect(devMode.style.transform).toBe('scale(1)')
  })

  it('should show Suspensive logo with opacity 100% if clicked', () => {
    const suspensive = new Suspensive()
    render(
      <SuspensiveProvider value={suspensive}>
        <DevMode />
      </SuspensiveProvider>
    )

    const devMode = screen.getByRole('Suspensive.DevMode-off')
    expect(devMode).toBeInTheDocument()
    fireEvent.click(devMode)
    expect(devMode.style.opacity).toBe('1')
  })

  it('should make Suspense with clientOnly prop show fallback if DevMode is clicked once', () => {
    const suspensive = new Suspensive()
    render(
      <SuspensiveProvider value={suspensive}>
        <Suspense
          clientOnly
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

    const devMode = screen.getByRole('Suspensive.DevMode-off')
    expect(devMode).toBeInTheDocument()
    fireEvent.click(devMode)
    expect(devMode.style.opacity).toBe('1')
    expect(screen.getByText('loading...')).toBeInTheDocument()
  })
  it('should make Suspense with clientOnly prop as no devMode if devMode prop is just object', () => {
    const suspensive = new Suspensive()
    render(
      <SuspensiveProvider value={suspensive}>
        <Suspense clientOnly fallback="loading..." devMode={{}}>
          children
        </Suspense>
        <DevMode />
      </SuspensiveProvider>
    )

    const devMode = screen.getByRole('Suspensive.DevMode-off')
    expect(devMode).toBeInTheDocument()
    fireEvent.click(devMode)
    expect(devMode.style.opacity).toBe('1')
    expect(screen.getByText('children')).toBeInTheDocument()
  })
  it('should make Suspense show fallback if DevMode is clicked once', () => {
    const suspensive = new Suspensive()
    render(
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

    const devMode = screen.getByRole('Suspensive.DevMode-off')
    expect(devMode).toBeInTheDocument()
    fireEvent.click(devMode)
    expect(devMode.style.opacity).toBe('1')
    expect(screen.getByText('loading...')).toBeInTheDocument()
  })
  it('should make Suspense as no devMode if devMode prop is just object', () => {
    const suspensive = new Suspensive()
    render(
      <SuspensiveProvider value={suspensive}>
        <Suspense fallback="loading..." devMode={{}}>
          children
        </Suspense>
        <DevMode />
      </SuspensiveProvider>
    )

    const devMode = screen.getByRole('Suspensive.DevMode-off')
    expect(devMode).toBeInTheDocument()
    fireEvent.click(devMode)
    expect(devMode.style.opacity).toBe('1')
    expect(screen.getByText('children')).toBeInTheDocument()
  })

  it('should make ErrorBoundary show fallback if DevMode is clicked once', () => {
    const suspensive = new Suspensive()
    render(
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

    const devMode = screen.getByRole('Suspensive.DevMode-off')
    expect(devMode).toBeInTheDocument()
    fireEvent.click(devMode)
    expect(devMode.style.opacity).toBe('1')
    expect(screen.getByText('errorBoundary fallback')).toBeInTheDocument()
  })
  it('should make ErrorBoundary as no devMode if devMode prop is just object', () => {
    const suspensive = new Suspensive()
    render(
      <SuspensiveProvider value={suspensive}>
        <ErrorBoundary fallback="errorBoundary fallback" devMode={{}}>
          children
        </ErrorBoundary>
        <DevMode />
      </SuspensiveProvider>
    )

    const devMode = screen.getByRole('Suspensive.DevMode-off')
    expect(devMode).toBeInTheDocument()
    fireEvent.click(devMode)
    expect(devMode.style.opacity).toBe('1')
    expect(screen.getByText('children')).toBeInTheDocument()
  })
})
