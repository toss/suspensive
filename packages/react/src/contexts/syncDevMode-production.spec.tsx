import { describe, expect, it } from 'vitest'
import { productionSyncDevMode } from './SuspensiveDevModeContext'

describe('syncDevMode in production mode', () => {
  it('should make component synced with DevMode in production mode', () => {
    expect(productionSyncDevMode()()).toBeNull()
  })
})
