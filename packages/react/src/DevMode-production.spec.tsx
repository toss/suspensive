import { ProductionDevMode } from './contexts/SuspensiveDevModeContext'

describe('<DevMode/> in production mode', () => {
  it('should show nothing if without SuspensiveProvider', () => {
    expect(ProductionDevMode()).toBeNull()
  })
})
