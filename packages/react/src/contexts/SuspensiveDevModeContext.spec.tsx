import { renderHook } from '@testing-library/react'
import { useContext } from 'react'
import { Suspensive, SuspensiveProvider } from '../Suspensive'
import { DevModeContext, SuspensiveDevMode } from './SuspensiveDevModeContext'

describe('DevModeContext', () => {
  it('returns null when no SuspensiveProvider is present', () => {
    const { result } = renderHook(() => useContext(DevModeContext))
    expect(result.current).toBeNull()
  })

  it('returns an instance of SuspensiveDevMode when wrapped with SuspensiveProvider', () => {
    const { result } = renderHook(() => useContext(DevModeContext), {
      wrapper: (props) => <SuspensiveProvider {...props} value={new Suspensive()} />,
    })
    expect(result.current).toBeInstanceOf(SuspensiveDevMode)
  })
})
