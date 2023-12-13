import { FALLBACK, TEXT } from '@suspensive/test-utils'
import { act, render, screen, waitFor } from '@testing-library/react'
import ms from 'ms'
import { describe, expect, vi } from 'vitest'
import { DevMode } from './DevMode'
import { Suspense } from './Suspense'

describe('<Dev.Suspend/>', () => {
  beforeEach(DevMode.on)

  it('should make `<Suspense/>` show fallback to develop loading or skeleton easily', async () => {
    vi.useFakeTimers()
    render(
      <Suspense fallback={FALLBACK}>
        <DevMode.Suspense showFallback />
        {TEXT}
      </Suspense>
    )
    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    act(() => vi.advanceTimersByTime(ms('1s')))
    await waitFor(() => expect(screen.queryByText(FALLBACK)).toBeInTheDocument())
    await waitFor(() => expect(screen.queryByText(TEXT)).not.toBeInTheDocument())

    act(() => vi.advanceTimersByTime(ms('1s')))
    await waitFor(() => expect(screen.queryByText(FALLBACK)).toBeInTheDocument())

    act(() => vi.advanceTimersByTime(ms('1s')))
    await waitFor(() => expect(screen.queryByText(FALLBACK)).toBeInTheDocument())
    await waitFor(() => expect(screen.queryByText(TEXT)).not.toBeInTheDocument())
  })
})
